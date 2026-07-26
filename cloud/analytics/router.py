"""
Analytics endpoints consumed by the React dashboard.

All queries run as traxia_app with full session GUCs from the caller's JWT,
so RLS automatically scopes results to the tenant/partner context.

Views used:
  site_traffic_daily      — row per (site, day); daily unique visitor counts
  site_traffic_comparison — row per (site, week); cross-site comparison
  zone_dwell_summary      — row per (zone, day); excludes staff_exclusion zones
"""
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from cloud.analytics.geometry import polygon_self_intersects
from cloud.auth.deps import _require_user_token
from cloud.db import user_conn
from cloud.findings.router import _presign_snapshot

router = APIRouter(prefix="/v1", tags=["analytics"])


# ---------------------------------------------------------------------------
# Traffic — site_traffic_daily
# ---------------------------------------------------------------------------

@router.get("/analytics/traffic")
def get_traffic(
    site_id: Optional[str] = Query(None),
    days: int = Query(30, ge=1, le=365),
    token: dict = Depends(_require_user_token),
) -> List[Dict[str, Any]]:
    with user_conn(token) as cur:
        sql = """
            SELECT site_id::text, site_name, day::text, unique_visitors, total_detections
            FROM   site_traffic_daily
            WHERE  day >= (CURRENT_DATE - (%s || ' days')::interval)::date
        """
        params: list = [days]
        if site_id:
            sql += " AND site_id = %s"
            params.append(site_id)
        sql += " ORDER BY day DESC, site_name"
        cur.execute(sql, params)
        return cur.fetchall()


# ---------------------------------------------------------------------------
# Comparison — site_traffic_comparison
# ---------------------------------------------------------------------------

@router.get("/analytics/comparison")
def get_comparison(
    weeks: int = Query(8, ge=1, le=52),
    token: dict = Depends(_require_user_token),
) -> List[Dict[str, Any]]:
    with user_conn(token) as cur:
        cur.execute("""
            SELECT site_id::text, site_name,
                   date_trunc('week', day)::text AS week,
                   SUM(unique_visitors)::int      AS unique_visitors
            FROM   site_traffic_daily
            WHERE  day >= (CURRENT_DATE - (%s || ' weeks')::interval)::date
            GROUP  BY site_id, site_name, week
            ORDER  BY week DESC, site_name
        """, [weeks])
        return cur.fetchall()


# ---------------------------------------------------------------------------
# Dwell — zone_dwell_summary
# ---------------------------------------------------------------------------

@router.get("/analytics/dwell")
def get_dwell(
    days: int = Query(30, ge=1, le=365),
    token: dict = Depends(_require_user_token),
) -> List[Dict[str, Any]]:
    with user_conn(token) as cur:
        cur.execute("""
            SELECT zone_id::text, zone_name, zone_type, day::text,
                   sessions, avg_dwell_seconds, max_dwell_seconds
            FROM   zone_dwell_summary
            WHERE  day >= (CURRENT_DATE - (%s || ' days')::interval)::date
            ORDER  BY day DESC, zone_name
        """, [days])
        return cur.fetchall()


# ---------------------------------------------------------------------------
# Sites, cameras, zones — used by Zones page
# ---------------------------------------------------------------------------

@router.get("/sites")
def list_sites(token: dict = Depends(_require_user_token)) -> List[Dict[str, Any]]:
    with user_conn(token) as cur:
        cur.execute("SELECT id::text, name, address FROM sites ORDER BY name")
        return cur.fetchall()


@router.get("/cameras")
def list_cameras(
    site_id: Optional[str] = Query(None),
    token: dict = Depends(_require_user_token),
) -> List[Dict[str, Any]]:
    with user_conn(token) as cur:
        if site_id and site_id != 'all':
            cur.execute(
                "SELECT id::text, name, site_id::text, status FROM cameras WHERE site_id = %s ORDER BY name",
                [site_id],
            )
        else:
            cur.execute("SELECT id::text, name, site_id::text, status FROM cameras ORDER BY name")
        return cur.fetchall()


@router.get("/cameras/{camera_id}/snapshot")
def get_snapshot(camera_id: str, token: dict = Depends(_require_user_token)) -> Dict[str, Any]:
    # Look up the most recent snapshot R2 key from agent_findings for zones
    # on this camera, then generate a short-lived pre-signed URL on demand.
    with user_conn(token) as cur:
        cur.execute("SELECT id FROM cameras WHERE id = %s", [camera_id])
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="camera_not_found")

        cur.execute(
            """
            SELECT af.detail->>'snapshot_r2_key' AS r2_key
              FROM agent_findings af
              JOIN zones z ON z.id = af.zone_id
             WHERE z.camera_id = %s
               AND af.detail ? 'snapshot_r2_key'
             ORDER BY af.created_at DESC
             LIMIT 1
            """,
            [camera_id],
        )
        row = cur.fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="no_snapshot_available")

    url = _presign_snapshot(row["r2_key"])
    if url is None:
        raise HTTPException(status_code=503, detail="snapshot_storage_not_configured")
    return {"snapshot_url": url}


@router.get("/zones")
def list_zones(
    camera_id: Optional[str] = Query(None),
    token: dict = Depends(_require_user_token),
) -> List[Dict[str, Any]]:
    with user_conn(token) as cur:
        if camera_id:
            cur.execute(
                "SELECT id::text, name, zone_type, camera_id::text, coordinates FROM zones WHERE camera_id = %s ORDER BY name",
                [camera_id],
            )
        else:
            cur.execute("SELECT id::text, name, zone_type, camera_id::text, coordinates FROM zones ORDER BY name")
        return cur.fetchall()


@router.post("/zones", status_code=201)
def create_zone(body: Dict[str, Any], token: dict = Depends(_require_user_token)) -> Dict[str, Any]:
    import json
    required = {"camera_id", "name", "zone_type", "coordinates"}
    missing = required - body.keys()
    if missing:
        raise HTTPException(status_code=422, detail=f"missing fields: {missing}")

    coords = body["coordinates"]
    pts = coords.get("points", []) if isinstance(coords, dict) else []
    if len(pts) < 3:
        raise HTTPException(status_code=422, detail="polygon must have at least 3 vertices")
    if polygon_self_intersects(pts):
        raise HTTPException(status_code=422, detail="polygon is self-intersecting")

    with user_conn(token) as cur:
        cur.execute("""
            INSERT INTO zones (camera_id, name, zone_type, coordinates)
            VALUES (%s, %s, %s, %s::jsonb)
            RETURNING id::text, name, zone_type, camera_id::text
        """, [
            body["camera_id"],
            body["name"],
            body["zone_type"],
            json.dumps(body["coordinates"]),
        ])
        return cur.fetchone()
