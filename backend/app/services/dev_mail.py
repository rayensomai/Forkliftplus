from __future__ import annotations

import threading
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from email import message_from_bytes
from typing import Any

from aiosmtpd.controller import Controller


@dataclass
class StoredEmail:
  id: str
  received_at: str
  mail_from: str
  recipients: list[str]
  subject: str
  text: str
  html: str | None = None


def _extract_part_content(part) -> str:
  payload = part.get_payload(decode=True)
  if payload is None:
    return ""
  charset = part.get_content_charset() or "utf-8"
  return payload.decode(charset, errors="replace")


def _parse_message_content(message) -> tuple[str, str | None]:
  text = ""
  html = None

  if message.is_multipart():
    for part in message.walk():
      content_type = part.get_content_type()
      if content_type == "text/plain" and not text:
        text = _extract_part_content(part)
      elif content_type == "text/html" and html is None:
        html = _extract_part_content(part)
  else:
    payload = _extract_part_content(message)
    if message.get_content_type() == "text/html":
      html = payload
    else:
      text = payload

  return text, html


class DevMailStore:
  def __init__(self) -> None:
    self._items: list[StoredEmail] = []
    self._lock = threading.Lock()

  def add(self, raw_content: bytes, envelope: Any) -> StoredEmail:
    message = message_from_bytes(raw_content)
    text, html = _parse_message_content(message)

    stored = StoredEmail(
      id=str(uuid.uuid4()),
      received_at=datetime.now(timezone.utc).isoformat(),
      mail_from=envelope.mail_from or "",
      recipients=list(envelope.rcpt_tos or []),
      subject=message.get("Subject", ""),
      text=text,
      html=html,
    )

    with self._lock:
      self._items.insert(0, stored)
      self._items = self._items[:100]

    return stored

  def list(self) -> list[StoredEmail]:
    with self._lock:
      return list(self._items)


dev_mail_store = DevMailStore()
_controller: Controller | None = None


class DevMailHandler:
  async def handle_DATA(self, server, session, envelope):  # noqa: ARG002
    try:
      dev_mail_store.add(envelope.content, envelope)
    except Exception as error:
      return f"550 Failed to store message: {error}"
    return "250 Message accepted for delivery"


def start_dev_mail_server(host: str = "127.0.0.1", port: int = 1025) -> Controller | None:
  global _controller
  if _controller is not None:
    return _controller

  _controller = Controller(DevMailHandler(), hostname=host, port=port)
  try:
    _controller.start()
  except OSError as error:
    _controller = None
    if getattr(error, "winerror", None) == 10048 or error.errno in {98, 10048}:
      return None
    raise
  return _controller


def stop_dev_mail_server() -> None:
  global _controller
  if _controller is not None:
    _controller.stop()
    _controller = None
