from html import escape

from fastapi import APIRouter
from fastapi.responses import HTMLResponse

from app.services.dev_mail import dev_mail_store

router = APIRouter()


@router.get("/emails")
def list_dev_emails():
  return {
    "count": len(dev_mail_store.list()),
    "items": [item.__dict__ for item in dev_mail_store.list()],
  }


@router.get("/emails/view", response_class=HTMLResponse)
def view_dev_emails():
  items = dev_mail_store.list()
  cards = []

  for item in items:
    body = item.html or f"<pre>{escape(item.text)}</pre>"
    cards.append(
      f"""
      <article class="mail-card">
        <header>
          <strong>{escape(item.subject or '(sans objet)')}</strong>
          <span>{escape(item.received_at)}</span>
        </header>
        <p><b>De:</b> {escape(item.mail_from)}</p>
        <p><b>A:</b> {escape(', '.join(item.recipients))}</p>
        <div class="mail-body">{body}</div>
      </article>
      """
    )

  if not cards:
    cards.append('<p class="empty">Aucun courriel capture pour le moment.</p>')

  return f"""
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>ForkliftPlus — Boite dev</title>
    <style>
      body {{ font-family: Arial, sans-serif; background: #f4f7fb; margin: 0; padding: 24px; color: #0f172a; }}
      .shell {{ max-width: 960px; margin: 0 auto; }}
      h1 {{ margin: 0 0 8px; }}
      .hint {{ color: #475569; margin-bottom: 24px; }}
      .mail-card {{ background: white; border: 1px solid #dbe7f3; border-radius: 16px; padding: 18px; margin-bottom: 16px; }}
      .mail-card header {{ display: flex; justify-content: space-between; gap: 12px; margin-bottom: 10px; }}
      .mail-body {{ border-top: 1px solid #e2e8f0; padding-top: 12px; overflow: auto; }}
      .empty {{ color: #64748b; }}
    </style>
  </head>
  <body>
    <div class="shell">
      <h1>Boite courriel de developpement</h1>
      <p class="hint">Les envois echoues vers Gmail sont captures ici automatiquement en mode dev.</p>
      {''.join(cards)}
    </div>
  </body>
</html>
"""
