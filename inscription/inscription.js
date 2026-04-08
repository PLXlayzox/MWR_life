/* =========================================
   INSCRIPTION – JAVASCRIPT + EMAILJS
   =========================================

   ⚙️  CONFIGURATION REQUISE (voir README en bas)
   Remplacez les 3 valeurs ci-dessous par vos
   vraies clés EmailJS.
   ========================================= */

const EMAILJS_PUBLIC_KEY  = 'CnKdIWI6zZlHCVB98';   // ← à remplacer
const EMAILJS_SERVICE_ID  = 'service_g0anqsj';   // ← à remplacer
const EMAILJS_TEMPLATE_ID = 'mwr_life';  // ← à remplacer

/* ---- Init EmailJS ---- */
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

/* ---- DOM ---- */
const form         = document.getElementById('inscriptionForm');
const submitBtn    = document.getElementById('submitBtn');
const successBlock = document.getElementById('successBlock');
const errorBlock   = document.getElementById('errorBlock');

/* ---- Helpers validation ---- */
function showError(id, msg) {
  const err = document.getElementById(id + 'Error');
  const inp = document.getElementById(id);
  if (err) err.textContent = msg;
  if (inp) inp.classList.add('error');
}
function clearError(id) {
  const err = document.getElementById(id + 'Error');
  const inp = document.getElementById(id);
  if (err) err.textContent = '';
  if (inp) inp.classList.remove('error');
}
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/* ---- Clear en temps réel ---- */
['firstName','lastName','email'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', () => clearError(id));
});
document.getElementById('consent')?.addEventListener('change', () => {
  document.getElementById('consentError').textContent = '';
});

/* ---- Réinitialiser après erreur ---- */
function resetForm() {
  errorBlock.style.display = 'none';
  submitBtn.disabled = false;
  submitBtn.querySelector('.btn-text').style.display = '';
  submitBtn.querySelector('.btn-loading').style.display = 'none';
}

/* ---- SUBMIT ---- */
form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Reset
  ['firstName','lastName','email'].forEach(clearError);
  document.getElementById('consentError').textContent = '';
  errorBlock.style.display = 'none';

  // Valeurs
  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const email     = document.getElementById('email').value.trim();
  const phone     = document.getElementById('phone').value.trim();
  const consent   = document.getElementById('consent').checked;

  // Validation
  let valid = true;
  if (!firstName)               { showError('firstName', 'Prénom requis.');              valid = false; }
  if (!lastName)                { showError('lastName',  'Nom requis.');                 valid = false; }
  if (!email)                   { showError('email', 'E-mail requis.');                  valid = false; }
  else if (!isValidEmail(email)){ showError('email', 'Adresse e-mail invalide.');        valid = false; }
  if (!consent)                 { document.getElementById('consentError').textContent = 'Consentement requis.'; valid = false; }

  if (!valid) return;

  // UI chargement
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').style.display    = 'none';
  submitBtn.querySelector('.btn-loading').style.display = 'inline-flex';

  // Paramètres envoyés au template EmailJS
  const templateParams = {
    to_email:   email,
    to_name:    firstName,
    first_name: firstName,
    last_name:  lastName,
    phone:      phone || 'Non renseigné',
    reply_to:   email,
  };

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

    // Succès
    form.style.display = 'none';
    document.getElementById('successName').textContent = firstName;
    successBlock.style.display = 'block';

  } catch (err) {
    console.error('EmailJS error:', err);
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').style.display    = '';
    submitBtn.querySelector('.btn-loading').style.display = 'none';
    errorBlock.style.display = 'block';
  }
});


/* =========================================
   📧 README – COMMENT CONFIGURER EMAILJS
   =========================================

   1. Créez un compte gratuit sur https://www.emailjs.com
      (200 emails/mois gratuits)

   2. Ajoutez un "Email Service" (Gmail, Outlook…)
      → Services → Add New Service
      → Copiez le SERVICE_ID dans EMAILJS_SERVICE_ID

   3. Créez un "Email Template"
      → Email Templates → Create New Template
      → Dans "To Email" mettez : {{to_email}}
      → Rédigez votre mail de bienvenue avec ces variables :
         • {{first_name}}  → Prénom de l'inscrit
         • {{last_name}}   → Nom de l'inscrit
         • {{to_name}}     → Prénom (alias)
         • {{phone}}       → Téléphone
      → Copiez le TEMPLATE_ID dans EMAILJS_TEMPLATE_ID

   4. Récupérez votre Public Key
      → Account → General → Public Key
      → Collez-la dans EMAILJS_PUBLIC_KEY

   ✅ Exemple de corps de mail dans EmailJS :
   -------------------------------------------
   Bonjour {{first_name}} !

   Merci pour votre inscription. Voici toutes les
   informations sur l'opportunité MWR Life :

   🌍 MWR Life est une plateforme qui vous donne accès
   à des réductions exclusives sur les voyages, hôtels,
   loisirs et divertissements, tout en vous permettant
   de générer des revenus supplémentaires grâce à un
   système de parrainage simple et transparent.

   🎯 Comment ça fonctionne :
   - Abonnement mensuel à tarif préférentiel
   - Accès immédiat à des milliers d'offres
   - Parrainez vos proches et touchez des commissions

   📞 Je suis disponible pour répondre à toutes vos
   questions. N'hésitez pas à me recontacter !

   À très bientôt,
   [Votre Nom]
   Membre indépendant MWR Life
   -------------------------------------------

   ========================================= */