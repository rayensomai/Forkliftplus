import smtplib
from email.message import EmailMessage

from fastapi import HTTPException

from app.core.config import settings


def send_email_message(email_message: EmailMessage) -> str:
  attempts: list[dict] = []

  primary_host = (settings.smtp_host or "localhost").strip()
  primary_port = settings.smtp_port or 1025

  if primary_host not in {"localhost", "127.0.0.1"}:
    attempts.append(
      {
        "host": primary_host,
        "port": primary_port,
        "mode": "starttls" if settings.smtp_use_tls else "plain",
        "username": settings.smtp_username,
        "password": settings.smtp_password,
        "delivery_mode": "smtp",
      }
    )

    if primary_host == "smtp.gmail.com":
      attempts.append(
        {
          "host": primary_host,
          "port": 465,
          "mode": "ssl",
          "username": settings.smtp_username,
          "password": settings.smtp_password,
          "delivery_mode": "smtp",
        }
      )

  if settings.dev_mail_enabled:
    attempts.append(
      {
        "host": "127.0.0.1",
        "port": settings.dev_mail_port,
        "mode": "plain",
        "username": "",
        "password": "",
        "delivery_mode": "dev_inbox",
      }
    )

  last_error = None
  for attempt in attempts:
    try:
      _deliver(email_message, attempt)
      return attempt["delivery_mode"]
    except Exception as error:
      last_error = error

  detail = f"Email service unavailable: {last_error}"
  if last_error and "535" in str(last_error):
    detail = (
      "Gmail a refuse la connexion (535). Creez un mot de passe d application Google "
      "sur https://myaccount.google.com/apppasswords puis mettez-le dans SMTP_PASSWORD "
      f"dans backend/.env. Erreur: {last_error}"
    )

  raise HTTPException(status_code=503, detail=detail) from last_error


def _deliver(email_message: EmailMessage, attempt: dict) -> None:
  mode = attempt["mode"]
  host = attempt["host"]
  port = attempt["port"]
  username = attempt["username"]
  password = attempt["password"]

  if mode == "ssl":
    with smtplib.SMTP_SSL(host, port, timeout=15) as server:
      if username:
        server.login(username, password)
      server.send_message(email_message)
    return

  with smtplib.SMTP(host, port, timeout=15) as server:
    server.ehlo()
    if mode == "starttls":
      server.starttls()
      server.ehlo()
    if username:
      server.login(username, password)
    server.send_message(email_message)
