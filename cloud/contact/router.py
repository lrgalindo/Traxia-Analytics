"""Demo request endpoint — public, no auth required.

POST /v1/contact/demo-request receives the lead form and sends a
notification email via Resend. No DB write — this is a pure forwarding
endpoint; CRM ingestion is a later concern.

Configuration (both required for email to send):
  RESEND_API_KEY    — API key from resend.com
  DEMO_NOTIFY_EMAIL — inbox that receives the notification (e.g. sales@traxia.io)

If either var is missing the endpoint still returns 200 and logs a warning
so that a missing config does not break a live demo of the product.
"""

import html
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import httpx
from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

from cloud import config

log = logging.getLogger(__name__)
router = APIRouter(prefix="/v1/contact", tags=["contact"])

_RESEND_EMAILS_URL = "https://api.resend.com/emails"


class DemoRequest(BaseModel):
    name: str
    email: EmailStr
    company: str
    what_to_solve: str

    model_config = {"json_schema_extra": {"example": {
        "name": "Ana López",
        "email": "ana@tienda.com",
        "company": "Tienda Demo SA",
        "what_to_solve": "Quiero reducir el shrinkage en perecederos y monitorear cumplimiento de planograma.",
    }}}


def _send_via_smtp(req: DemoRequest, subject: str, html_body: str) -> None:
    """Send via SMTP when SMTP_HOST is configured (fallback / local testing)."""
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = config.RESEND_FROM or f"noreply@traxia.io"
    msg["To"] = config.DEMO_NOTIFY_EMAIL
    msg["Reply-To"] = req.email
    msg.attach(MIMEText(html_body, "html"))

    host = config.SMTP_HOST
    port = int(config.SMTP_PORT or "25")
    with smtplib.SMTP(host, port, timeout=10) as s:
        if config.SMTP_USER and config.SMTP_PASS:
            s.starttls()
            s.login(config.SMTP_USER, config.SMTP_PASS)
        s.send_message(msg)
    log.info(
        "Demo request email sent via SMTP: company=%r email=%s host=%s",
        req.company, req.email, host,
    )


def _send_demo_notification(req: DemoRequest) -> None:
    """Send a demo-request notification email via Resend.

    Uses onboarding@resend.dev as the sender — works on the free tier
    without domain verification. Override RESEND_FROM if a verified
    domain sender is configured.
    """
    has_resend = bool(config.RESEND_API_KEY)
    has_smtp = bool(config.SMTP_HOST)
    if not config.DEMO_NOTIFY_EMAIL or (not has_resend and not has_smtp):
        log.warning(
            "Demo request received from %s <%s> but no email transport is configured "
            "(set RESEND_API_KEY or SMTP_HOST, and DEMO_NOTIFY_EMAIL).",
            req.name, req.email,
        )
        return

    from_addr = config.RESEND_FROM or "onboarding@resend.dev"
    # All user-supplied fields are HTML-escaped before interpolation.
    name_s = html.escape(req.name)
    email_s = html.escape(req.email, quote=True)
    company_s = html.escape(req.company)
    solve_s = html.escape(req.what_to_solve).replace("\n", "<br>")
    subject = f"Nueva solicitud de demo — {req.company}"
    html_body = f"""
<h2>Nueva solicitud de demo</h2>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
  <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Nombre</td>
      <td style="padding:6px 12px">{name_s}</td></tr>
  <tr style="background:#f9f9f9">
      <td style="padding:6px 12px;font-weight:bold;color:#555">Correo</td>
      <td style="padding:6px 12px"><a href="mailto:{email_s}">{email_s}</a></td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;color:#555">Empresa</td>
      <td style="padding:6px 12px">{company_s}</td></tr>
  <tr style="background:#f9f9f9">
      <td style="padding:6px 12px;font-weight:bold;color:#555;vertical-align:top">Qué quiere resolver</td>
      <td style="padding:6px 12px">{solve_s}</td></tr>
</table>
<p style="color:#888;font-size:12px;margin-top:24px">Enviado desde el formulario de solicitud de demo de Traxia.</p>
"""

    if config.SMTP_HOST:
        _send_via_smtp(req, subject, html_body)
        return

    with httpx.Client(timeout=10.0) as client:
        resp = client.post(
            _RESEND_EMAILS_URL,
            headers={
                "Authorization": f"Bearer {config.RESEND_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "from": from_addr,
                "to": [config.DEMO_NOTIFY_EMAIL],
                "reply_to": req.email,
                "subject": subject,
                "html": html_body,
            },
        )

    if resp.is_success:
        log.info(
            "Demo request email sent: company=%r email=%s resend_id=%s",
            req.company, req.email, resp.json().get("id"),
        )
    else:
        log.error(
            "Failed to send demo request email for %s: HTTP %s",
            req.email, resp.status_code,
        )


@router.post("/demo-request", status_code=200)
def demo_request(body: DemoRequest) -> dict:
    """Receive a demo request and send a notification email.

    Always returns 200 to the submitter — email delivery failures are
    logged server-side but do not surface as errors to the lead.
    """
    log.info(
        "Demo request received: name=%r company=%r email=%s",
        body.name, body.company, body.email,
    )
    _send_demo_notification(body)
    return {"ok": True}
