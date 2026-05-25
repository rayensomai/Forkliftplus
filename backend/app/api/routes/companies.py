from email.message import EmailMessage
from html import escape
from types import SimpleNamespace

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db import models
from app.db.deps import get_db
from app.schemas.company import CampaignEmailIn, CollaborationEmailIn, CompanyIn, CompanyOut
from app.services.email_sender import send_email_message

router = APIRouter()


PROMOTIONAL_SHOWCASE = [
  {
    "src": "https://www.forkliftplus.com/wp-content/uploads/2023/05/Cat-2P5000.jpg",
    "alt": "Chariot propane CAT 5 000 lb",
    "tag": "Best-seller",
  },
  {
    "src": "https://www.forkliftplus.com/wp-content/uploads/2024/03/Lithium-Pallet-Truck-ELF-EPT33H.jpg",
    "alt": "Chariot electrique lithium",
    "tag": "Zero emission",
  },
  {
    "src": "https://www.forkliftplus.com/wp-content/uploads/2024/06/electric-pallte-truck-home-1.jpg",
    "alt": "Transpalette electrique ELF",
    "tag": "Entrepot rapide",
  },
  {
    "src": "https://www.forkliftplus.com/wp-content/uploads/2024/10/Skyjack-3219.jpg",
    "alt": "Scissor lift Skyjack",
    "tag": "Hauteur securisee",
  },
  {
    "src": "https://www.forkliftplus.com/wp-content/uploads/2020/01/Diesel-Forklift.png",
    "alt": "Chariot diesel terrain exigeant",
    "tag": "Puissance lourde",
  },
  {
    "src": "https://www.forkliftplus.com/wp-content/uploads/2020/12/forklift-accessories-dark_a50df82e4e1563d904bf7b2af787fbdf-min.jpg",
    "alt": "Accessoires et pieces OEM",
    "tag": "Support total",
  },
]


def _build_promotional_html(company, subject: str, message_body: str) -> str:
  company_name = escape(company.name)
  company_city = escape(company.city)
  company_region = escape(company.region)
  company_focus = escape(company.focus)
  company_address = escape(company.address or "Adresse non disponible")
  company_email = escape(company.email)
  subject_text = escape(subject)
  message_text = escape(message_body).replace("\n", "<br />")

  ribbon_cards = "".join(
    f"""
      <div class=\"email-ribbon-card\">
        <img src=\"{escape(item['src'])}\" alt=\"{escape(item['alt'])}\" />
        <strong>{escape(item['alt'])}</strong>
        <span>{escape(item.get('tag', 'ForkliftPlus'))}</span>
      </div>
    """
    for item in PROMOTIONAL_SHOWCASE
  )

  return f"""
<!doctype html>
<html lang=\"fr\">
  <head>
    <meta charset=\"utf-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <style>
      @keyframes ribbon-slide {{
        0% {{ transform: translateX(0); }}
        100% {{ transform: translateX(-50%); }}
      }}

      @keyframes glow-pulse {{
        0%, 100% {{ box-shadow: 0 18px 40px rgba(8, 47, 73, 0.12); }}
        50% {{ box-shadow: 0 24px 50px rgba(8, 47, 73, 0.22); }}
      }}

      body {{ margin: 0; padding: 0; background: #f4f7fb; font-family: Arial, Helvetica, sans-serif; color: #0f172a; }}
      .email-shell {{ max-width: 720px; margin: 0 auto; padding: 28px 16px; }}
      .email-card {{ background: #ffffff; border-radius: 28px; overflow: hidden; border: 1px solid #dbe7f3; animation: glow-pulse 5s ease-in-out infinite; }}
      .email-header {{ background: linear-gradient(135deg, #0f4c81, #1d9bd1); color: white; padding: 26px 28px; position: relative; overflow: hidden; }}
      .email-header::after {{ content: ''; position: absolute; inset: 0; background: linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.16), transparent 80%); transform: translateX(-100%); animation: sheen 4.8s infinite; }}
      @keyframes sheen {{ 0% {{ transform: translateX(-100%); }} 50% {{ transform: translateX(110%); }} 100% {{ transform: translateX(110%); }} }}
      .brand-row {{ display: flex; align-items: center; gap: 14px; position: relative; z-index: 1; }}
      .brand-row img {{ width: 68px; height: 68px; object-fit: contain; border-radius: 18px; background: rgba(255,255,255,0.16); padding: 8px; }}
      .brand-row h1 {{ margin: 0; font-size: 26px; line-height: 1.1; }}
      .brand-row p {{ margin: 4px 0 0; opacity: 0.88; }}
      .pill-row {{ display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; position: relative; z-index: 1; }}
      .pill {{ background: rgba(255,255,255,0.16); border: 1px solid rgba(255,255,255,0.22); border-radius: 999px; padding: 8px 12px; font-size: 12px; }}
      .email-body {{ padding: 28px; }}
      .intro-grid {{ display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 20px; align-items: start; }}
      .intro-card {{ background: #f8fbfe; border: 1px solid #e0ecf6; border-radius: 22px; padding: 20px; }}
      .intro-card h2 {{ margin: 0 0 10px; font-size: 22px; }}
      .intro-card p {{ margin: 0 0 12px; line-height: 1.6; color: #334155; }}
      .message-box {{ background: #fff; border-left: 4px solid #1d9bd1; padding: 16px 18px; border-radius: 18px; color: #0f172a; line-height: 1.7; }}
      .stats {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 14px; }}
      .stat {{ background: #ffffff; border: 1px solid #dbe7f3; border-radius: 18px; padding: 14px; text-align: center; }}
      .stat strong {{ display: block; font-size: 18px; color: #0f4c81; }}
      .stat span {{ display: block; margin-top: 6px; color: #64748b; font-size: 12px; }}
      .ribbon-wrap {{ margin: 26px 0; overflow: hidden; border-radius: 24px; background: linear-gradient(135deg, #082f49, #0f4c81); padding: 16px 0; }}
      .ribbon-track {{ display: flex; gap: 14px; width: max-content; animation: ribbon-slide 18s linear infinite; padding-left: 14px; }}
      .email-ribbon-card {{ min-width: 180px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.18); border-radius: 18px; padding: 12px; color: #fff; text-align: center; }}
      .email-ribbon-card img {{ width: 100%; height: 112px; object-fit: contain; background: rgba(255,255,255,0.92); border-radius: 14px; }}
      .email-ribbon-card strong {{ display: block; margin-top: 10px; font-size: 13px; line-height: 1.3; }}
      .footer-note {{ margin-top: 20px; font-size: 13px; color: #64748b; line-height: 1.6; }}
      .cta-box {{ margin-top: 18px; background: linear-gradient(135deg, rgba(29,155,209,0.12), rgba(15,76,129,0.08)); border: 1px solid #cfe4f2; border-radius: 20px; padding: 16px; }}
      .cta-box strong {{ display: block; margin-bottom: 6px; color: #0f4c81; }}
      .cta-link {{ color: #0f4c81; text-decoration: none; font-weight: 700; }}
      @media (max-width: 640px) {{
        .email-body {{ padding: 20px; }}
        .intro-grid {{ grid-template-columns: 1fr; }}
        .stats {{ grid-template-columns: 1fr; }}
      }}
    </style>
  </head>
  <body>
    <div class=\"email-shell\">
      <div class=\"email-card\">
        <div class=\"email-header\">
          <div class=\"brand-row\">
            <img src=\"https://www.forkliftplus.com/wp-content/uploads/2020/06/forklift-250.png\" alt=\"Forklift Plus\" />
            <div>
              <h1>ForkliftPlus x {company_name}</h1>
              <p>Une proposition de collaboration visuelle, rapide et mémorable.</p>
            </div>
          </div>
          <div class=\"pill-row\">
            <span class=\"pill\">Zero frais de demarrage</span>
            <span class=\"pill\">Commission sur ventes</span>
            <span class=\"pill\">Visibilite marketplace</span>
            <span class=\"pill\">Support bilingue 24/7</span>
          </div>
        </div>

        <div class=\"email-body\">
          <div class=\"intro-grid\">
            <div class=\"intro-card\">
              <h2>Bonjour {company_name},</h2>
              <p>
                Nous souhaitons vous proposer une collaboration qui met en valeur vos besoins et nos solutions
                logistiques. Voici une version publicitaire, moderne et très visuelle de notre prise de contact.
              </p>
              <div class=\"message-box\">{message_text}</div>
              <div class=\"cta-box\">
                <strong>Pourquoi dire oui a ForkliftPlus ?</strong>
                <p style=\"margin:0;\">Visibilite premium, co-marketing anime, leads qualifies dans votre zone, inventaire dynamique et accompagnement bilingue — sans investissement initial de votre cote.</p>
              </div>
            </div>
            <div class=\"intro-card\">
              <h2>Fiche partenaire</h2>
              <div class=\"stats\">
                <div class=\"stat\"><strong>{company_city}</strong><span>Ville</span></div>
                <div class=\"stat\"><strong>{company_region}</strong><span>Région</span></div>
                <div class=\"stat\"><strong>{company_focus}</strong><span>Spécialité</span></div>
              </div>
              <p style=\"margin-top:14px;\"><strong>Adresse :</strong> {company_address}</p>
              <p><strong>Courriel :</strong> {company_email}</p>
              <p><strong>Objet proposé :</strong> {subject_text}</p>
            </div>
          </div>

          <div class=\"ribbon-wrap\">
            <div class=\"ribbon-track\">{ribbon_cards}{ribbon_cards}</div>
          </div>

          <p class=\"footer-note\">
            Ce message est conçu pour être original et accrocheur dans les clients courriel qui prennent en charge le HTML.
            Vous pouvez le personnaliser avant l’envoi.
          </p>
        </div>
      </div>
    </div>
  </body>
</html>
"""


@router.get("/", response_model=list[CompanyOut])
def list_companies(db: Session = Depends(get_db)):
  # Companies are permanent records — no delete endpoint is exposed.
  return db.query(models.Company).order_by(models.Company.id.asc()).all()


def _resolve_company(db: Session, payload: CampaignEmailIn):
  if payload.company_id:
    company = db.query(models.Company).filter(models.Company.id == payload.company_id).first()
    if company:
      return company

  if payload.company_name:
    company = (
      db.query(models.Company)
      .filter(models.Company.name == payload.company_name.strip())
      .first()
    )
    if company:
      return company

  return SimpleNamespace(
    name=payload.company_name.strip(),
    email=(payload.company_email or payload.recipient_email).strip(),
    address=payload.company_address.strip(),
    city=payload.company_city.strip(),
    region=payload.company_region.strip(),
    focus=payload.company_focus.strip() or "Partenaire logistique",
  )


def _send_campaign_email(company, recipient_email: str, subject: str, message_body: str, reply_to: str | None) -> str:
  email_message = EmailMessage()
  email_message["Subject"] = subject
  email_message["From"] = settings.smtp_from_email
  email_message["To"] = recipient_email
  if reply_to:
    email_message["Reply-To"] = reply_to

  email_message.set_content(
    f"Company: {company.name}\nAddress: {company.address}\nCity: {company.city}, {company.region}\nEmail: {company.email}\n\n{message_body}\n\nVoir la version HTML pour le rendu visuel."
  )
  email_message.add_alternative(
    _build_promotional_html(company, subject, message_body),
    subtype="html",
  )
  return send_email_message(email_message)


@router.post("/send-campaign")
def send_campaign_email(payload: CampaignEmailIn, db: Session = Depends(get_db)):
  subject = payload.subject.strip()
  message_body = payload.message.strip()
  recipient_email = payload.recipient_email.strip()

  if not subject or not message_body or not recipient_email:
    raise HTTPException(status_code=400, detail="Subject, message, and recipient email are required")

  company = _resolve_company(db, payload)

  try:
    delivery_mode = _send_campaign_email(
      company,
      recipient_email,
      subject,
      message_body,
      payload.reply_to_email.strip() if payload.reply_to_email else None,
    )
  except HTTPException:
    raise
  except Exception as send_error:
    raise HTTPException(
      status_code=503,
      detail=f"Email service unavailable: {send_error}",
    ) from send_error

  response = {"status": "sent", "company": company.name, "recipient": recipient_email, "delivery_mode": delivery_mode}
  if delivery_mode == "dev_inbox":
    response["dev_inbox_url"] = "http://localhost:8000/dev/emails/view"
  return response


@router.get("/{company_id}", response_model=CompanyOut)
def get_company(company_id: int, db: Session = Depends(get_db)):
  company = db.query(models.Company).filter(models.Company.id == company_id).first()
  if not company:
    raise HTTPException(status_code=404, detail="Company not found")
  return company


@router.post("/{company_id}/collaboration-email")
def send_collaboration_email(
  company_id: int,
  payload: CollaborationEmailIn,
  db: Session = Depends(get_db),
):
  company = db.query(models.Company).filter(models.Company.id == company_id).first()
  if not company:
    raise HTTPException(status_code=404, detail="Company not found")

  subject = payload.subject.strip()
  message_body = payload.message.strip()
  if not subject or not message_body:
    raise HTTPException(status_code=400, detail="Subject and message are required")

  recipient_email = payload.recipient_email.strip() if payload.recipient_email else company.email

  try:
    delivery_mode = _send_campaign_email(
      company,
      recipient_email,
      subject,
      message_body,
      payload.reply_to_email.strip() if payload.reply_to_email else None,
    )
  except HTTPException:
    raise
  except Exception as send_error:
    raise HTTPException(
      status_code=503,
      detail=f"Email service unavailable: {send_error}",
    ) from send_error

  response = {"status": "sent", "company": company.name, "recipient": recipient_email, "delivery_mode": delivery_mode}
  if delivery_mode == "dev_inbox":
    response["dev_inbox_url"] = "http://localhost:8000/dev/emails/view"
  return response


@router.post("/", response_model=CompanyOut, status_code=status.HTTP_201_CREATED)
def create_company(payload: CompanyIn, db: Session = Depends(get_db)):
  exists = db.query(models.Company).filter(models.Company.name == payload.name).first()
  if exists:
    raise HTTPException(status_code=409, detail="Company already exists")

  company = models.Company(**payload.model_dump())
  db.add(company)
  db.commit()
  db.refresh(company)
  return company


@router.post("/seed")
def seed_companies(db: Session = Depends(get_db)):
  exists = db.query(models.Company).first()
  if exists:
    return {"status": "ok", "seeded": 0}

  seed = [
    {
      "name": "NordLift Logistics",
      "email": "contact@nordliftlogistics.com",
      "address": "2150 Boulevard Hymus, Dorval, QC H9P 1J7",
      "city": "Montreal",
      "region": "QC",
      "focus": "Forklifts",
      "lat": 45.5017,
      "lng": -73.5673,
    },
    {
      "name": "Atlas Yard Network",
      "email": "hello@atlasyardnetwork.com",
      "address": "200 King St W, Toronto, ON M5H 3T4",
      "city": "Toronto",
      "region": "ON",
      "focus": "Heavy rental",
      "lat": 43.6532,
      "lng": -79.3832,
    },
    {
      "name": "Pacific Freight Hub",
      "email": "sales@pacificfreighthub.com",
      "address": "401 Burrard St, Vancouver, BC V6C 3S5",
      "city": "Vancouver",
      "region": "BC",
      "focus": "Port handling",
      "lat": 49.2827,
      "lng": -123.1207,
    },
    {
      "name": "Prairie Lift Co",
      "email": "contact@prairieliftco.com",
      "address": "300 Portage Ave, Winnipeg, MB R3C 0B4",
      "city": "Winnipeg",
      "region": "MB",
      "focus": "Warehouse ops",
      "lat": 49.8951,
      "lng": -97.1384,
    },
    {
      "name": "Atlantic Fleet",
      "email": "partnerships@atlanticfleet.com",
      "address": "1801 Hollis St, Halifax, NS B3J 3N4",
      "city": "Halifax",
      "region": "NS",
      "focus": "Maritime",
      "lat": 44.6488,
      "lng": -63.5752,
    },
    {
      "name": "Northern Axis",
      "email": "info@northernaxis.com",
      "address": "101 Rue Saint-Jean, Quebec, QC G1R 1N8",
      "city": "Quebec",
      "region": "QC",
      "focus": "Cross-dock",
      "lat": 46.8139,
      "lng": -71.2080,
    },
  ]

  db.add_all([models.Company(**item) for item in seed])
  db.commit()
  return {"status": "ok", "seeded": len(seed)}
