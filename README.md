(ForkliftPlus)

## Courriel promotionnel

Le bouton de collaboration envoie maintenant un vrai courriel HTML avec un ruban animé et des visuels de machines.

Pour tester l'envoi en local:

1. Lancez le SMTP de développement.

```bash
docker compose up -d mailhog
```

2. Démarrez le backend et le frontend.

3. Ouvrez la boîte MailHog sur [http://localhost:8025](http://localhost:8025) pour voir les courriels envoyés.

Si vous voulez un envoi vers de vrais destinataires, remplacez les variables SMTP dans `backend/.env` par votre relais réel.
