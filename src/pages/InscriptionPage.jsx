import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faCheck, faXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import ReCAPTCHA from 'react-google-recaptcha';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// ── Constants ─────────────────────────────────────────────────────────────────

const INPUT_CLS =
  'w-full border border-sand rounded-lg font-sans text-sm text-ink px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terracotta/40 bg-white';
const INPUT_ERR_CLS =
  'w-full border border-terracotta rounded-lg font-sans text-sm text-ink px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terracotta/40 bg-white';

const DOMAINES = [
  'Agriculture & Agroalimentaire',
  "Artisanat & Métiers d'art",
  'Bâtiment & Travaux publics',
  'Commerce & Distribution',
  'Communication & Marketing',
  'Droit & Notariat',
  'Économie',
  'Éducation & Formation',
  'Électronique',
  'Finance & Comptabilité',
  'Gestion',
  'Géologie & Mines',
  'Informatique & Tech',
  'Médical & Paramédical',
  'Restauration & Hôtellerie',
  'Services à la personne',
  'Sport & Bien-être',
  'Transport & Logistique',
  'Topographie & foncier',
  'Autre',
];

const EXPERIENCE_OPTIONS = [
  'Moins de 2 ans',
  '2 – 5 ans',
  '5 – 10 ans',
  '10 – 20 ans',
  'Plus de 20 ans',
];

const NIVEAUX = [
  'L1',
  'L2',
  'L3',
  'M1',
  'M2',
  'D1',
  'D2',
  'D3'
];

// ── Image compression helper ──────────────────────────────────────────────────

function compressImage(file, maxSize = 400, quality = 0.8) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > h && w > maxSize) { h = Math.round(h * maxSize / w); w = maxSize; }
        else if (h > maxSize)     { w = Math.round(w * maxSize / h); h = maxSize; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

function InscriptionPage() {
  const [fields, setFields] = useState({
    prenom: '',
    nom: '',
    age : 14,
    sex : '',
    adresse : '',
    ville : '',
    email: '',
    telephone: '',
    whatsapp: '',
    fb_account: '',
    metier: '',
    entreprise: '',
    domaine: '',
    experience: '',
    bio: '',
    commune: '',
    district: '',
    specialite: '',
    universite: '',
    etablissement: '',
    niveau: '',
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [photoBase64, setPhotoBase64] = useState('');
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [captchaToken, setCaptchaToken] = useState(null);
  const photoInputRef = useRef(null);
  const captchaRef = useRef(null);

  // ── Toast auto-dismiss ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  // ── Validation ───────────────────────────────────────────────────────────────

  function validate() 
  {
    const errs = {};
    if (!photoBase64) errs.photo = 'Une photo est requise.';
    if (!fields.prenom.trim()) errs.prenom = 'Prénom requis.';
    if (!fields.nom.trim()) errs.nom = 'Nom requis.';
    if (!fields.age || fields.age < 14) errs.age = 'Âge requis (minimum 14 ans).';
    if (!fields.sex) errs.sex = 'Sexe requis.';
    if (!fields.adresse.trim()) errs.adresse = 'Adresse requise.';
    if (!fields.commune.trim()) errs.commune = 'Commune requise.';
    if (!fields.district.trim()) errs.district = 'District requis.';
    if (!fields.universite.trim()) errs.universite = 'Université requise.';
    if (!fields.etablissement.trim()) errs.etablissement = 'Etablissement requis.';
    if (!fields.niveau) errs.niveau = 'Niveau requis.';

    if (!fields.email.trim()) {
      errs.email = 'Email requis.';
    } else if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(fields.email)) {
      errs.email = 'Format email invalide.';
    }
    if (!fields.metier.trim()) errs.metier = 'Métier requis.';
    if (!fields.domaine) errs.domaine = 'Domaine requis.';
    if (!fields.niveau) errs.niveau = 'Niveau requis.';
    if (!fields.ville.trim()) errs.ville = 'Ville requise.';
    if (!fields.bio.trim()) {
      errs.bio = 'Informations complémentaires requise.';
    } else if (fields.bio.trim().length < 50) {
      errs.bio = 'Minimum 50 caractères.';
    }
    if (!fields.consent) errs.consent = 'Consentement requis.';
    if (!captchaToken) errs.captcha = 'Veuillez cocher le CAPTCHA pour confirmer que vous n\êtes pas un robot.';
    return errs;
  }

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleField(e) {
    const { name, value, type, checked } = e.target;
    setFields(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: 'Photo trop volumineuse (max 5 Mo).' }));
      return;
    }
    setErrors(prev => ({ ...prev, photo: undefined }));
    const dataUrl = await compressImage(file);
    setPhotoPreviewUrl(dataUrl);
    setPhotoBase64(dataUrl.split(',')[1]);
  }

  function handlePhotoClear(e) {
    e.stopPropagation();
    setPhotoPreviewUrl('');
    setPhotoBase64('');
    if (photoInputRef.current) photoInputRef.current.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      document.getElementById(firstKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    const payload = {
      prenom: fields.prenom.trim(),
      nom: fields.nom.trim(),
      age: fields.age,
      sex: fields.sex,
      adresse: fields.adresse.trim(),
      ville: fields.ville.trim(),
      email: fields.email.trim(),
      telephone: fields.telephone.trim(),
      whatsapp: fields.whatsapp.trim(),
      fb_account: fields.fb_account.trim(),
      bio: fields.bio.trim(),
      commune: fields.commune.trim(),
      district: fields.district.trim(),
      metier: fields.metier.trim(),
      entreprise: fields.entreprise.trim(),
      domaine: fields.domaine,
      experience: fields.experience,
      specialite: fields.specialite.trim(),
      universite: fields.universite.trim(),
      etablissement: fields.etablissement.trim(),
      niveau: fields.niveau,
      statut: 'EN ATTENTE',
      date_inscription: new Date().toLocaleDateString('fr-FR'),
      photo_base64: photoBase64,
      photo_mime: photoBase64 ? 'image/jpeg' : '',
    };

    try {
      await fetch(process.env.REACT_APP_SHEET_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch {
      captchaRef.current?.reset();
      setCaptchaToken(null);
      setToast('Une erreur est survenue. Veuillez réessayer ou contacter le webmaster.');
    } finally {
      setLoading(false);
    }
  }

  // ── Render helpers ───────────────────────────────────────────────────────────

  const opt = <span className="font-sans text-xs text-muted font-normal"> (optionnel)</span>;

  function FieldError({ name }) {
    return errors[name]
      ? <p className="font-sans text-xs text-terracotta mt-1">{errors[name]}</p>
      : null;
  }

  function SectionHeading({ children }) {
    return (
      <h3 className="font-serif text-base font-semibold text-soil border-b border-sand pb-1 mb-4">
        {children}
      </h3>
    );
  }

  // ── JSX ──────────────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-terracotta flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faCheck} className="text-cream text-3xl" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-terracotta mb-3">Demande envoyée !</h2>
          <p className="font-sans text-sm text-ink leading-relaxed mb-6">
            Votre candidature a été reçue. Vous recevrez une confirmation par email.
          </p>
          <Link
            to="/"
            className="inline-block bg-soil text-cream font-sans text-sm font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Retour à l'annuaire
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-terracotta text-cream font-sans text-sm px-4 py-3 rounded-lg shadow-lg max-w-sm w-full">
          <span className="flex-1">{toast}</span>
          <button type="button" onClick={() => setToast(null)} className="shrink-0 hover:opacity-70">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}

      {/* Hero — matches DirectoryPage style */}
      <section
        className="text-cream pt-24 pb-10 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #2C1A0E 0%, #3A2010 50%, #5A2E10 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(232,201,122,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(193,68,14,0.1) 0%, transparent 40%)'
        }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <span className="inline-block font-sans text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-5" style={{ background: 'rgba(232,201,122,0.15)', border: '1px solid rgba(232,201,122,0.3)', color: '#E8C97A' }}>
            Formulaire d'inscription
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream leading-tight">
            Rejoignez <em className="text-wheat italic">l'annuaire</em>
          </h1>
          <p className="font-sans text-sm text-cream/70 mt-3 max-w-lg mx-auto">
            Renseignez vos informations. Votre fiche sera examinée par le président avant publication.
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-6 py-10">

      {/* Validation notice */}
      <div className="flex gap-3 items-start rounded-lg mb-8 px-5 py-4" style={{ background: '#FFF8E7', border: '1px solid #E8C97A', borderLeft: '4px solid #C1440E' }}>
        <span className="text-xl shrink-0">⏳</span>
        <p className="font-sans text-sm leading-relaxed" style={{ color: '#7A5C2A' }}>
          <strong className="font-semibold" style={{ color: '#2C1A0E' }}>Validation requise :</strong>{' '}
          Après soumission, votre fiche sera examinée par le président de l'association. Vous recevrez une notification par email une fois validée.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Two-column grid: photo sidebar | fields */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">

          {/* ── Left column: photo zone ── */}
          <div className="flex flex-col items-center md:items-start">
            <label className="font-sans text-xs font-semibold text-ink mb-2 block">
              Photo de profil <span className="text-terracotta">*</span>
            </label>

            {/* Photo zone */}
            <div
              id="photo"
              role="button"
              tabIndex={0}
              onClick={() => photoInputRef.current?.click()}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && photoInputRef.current?.click()}
              className="relative w-40 h-40 md:w-full md:h-auto md:aspect-square border-2 border-dashed border-sand rounded-xl flex items-center justify-center cursor-pointer bg-cream/50 hover:border-terracotta/50 transition-colors overflow-hidden"
            >
              {photoPreviewUrl ? (
                <>
                  <img
                    src={photoPreviewUrl}
                    alt="Aperçu de profil"
                    className="w-full h-full object-cover"
                  />
                  {/* Clear button */}
                  <button
                    type="button"
                    onClick={handlePhotoClear}
                    className="absolute top-1 right-1 w-6 h-6 bg-ink/70 hover:bg-ink text-cream rounded-full flex items-center justify-center transition-colors"
                    aria-label="Supprimer la photo"
                  >
                    <FontAwesomeIcon icon={faXmark} className="text-xs" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 px-3 text-center">
                  <FontAwesomeIcon icon={faCamera} className="text-2xl text-muted" />
                  <p className="font-sans text-xs text-muted leading-snug">
                    Cliquez ou glissez une photo
                  </p>
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={photoInputRef}
              type="file"
              id="photo-input"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            {errors.photo && (
              <p className="font-sans text-xs text-terracotta mt-1 text-center md:text-left">
                {errors.photo}
              </p>
            )}
          </div>

          {/* ── Right column: all field sections ── */}
          <div className="space-y-8">

            {/* ── Section: Identité ── */}
            <section>
              <SectionHeading>Identité personnelle</SectionHeading>
              <div className="space-y-4">
                {/* Prénom + Nom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="prenom">
                      Prénom <span className="text-terracotta">*</span>
                    </label>
                    <input
                      id="prenom"
                      name="prenom"
                      type="text"
                      value={fields.prenom}
                      onChange={handleField}
                      className={errors.prenom ? INPUT_ERR_CLS : INPUT_CLS}
                      placeholder="Rakoto"
                    />
                    <FieldError name="prenom" />
                  </div>
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="nom">
                      Nom <span className="text-terracotta">*</span>
                    </label>
                    <input
                      id="nom"
                      name="nom"
                      type="text"
                      value={fields.nom}
                      onChange={handleField}
                      className={errors.nom ? INPUT_ERR_CLS : INPUT_CLS}
                      placeholder="Malala"
                    />
                    <FieldError name="nom" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="age">
                      Age <span className="text-terracotta">*</span>
                    </label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      value={fields.age}
                      onChange={handleField}
                      className={errors.age ? INPUT_ERR_CLS : INPUT_CLS}
                      min={14}
                    />
                    <FieldError name="age" />
                  </div>
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="sex">
                      Sexe <span className="text-terracotta">*</span>
                    </label>
                    <select
                      id="sex"
                      name="sex"
                      value={fields.sex}
                      onChange={handleField}
                      className={errors.sex ? INPUT_ERR_CLS : INPUT_CLS}
                    >
                      <option value="">Sélectionnez votre sexe</option>
                      <option value="homme">Homme</option>
                      <option value="femme">Femme</option>
                    </select>
                    <FieldError name="sex" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="adresse">
                      Adresse <span className="text-terracotta">*</span>
                    </label>
                    <input
                      id="adresse"
                      name="adresse"
                      type="text"
                      value={fields.adresse}
                      onChange={handleField}
                      className={errors.adresse ? INPUT_ERR_CLS : INPUT_CLS}
                      placeholder="Lot III S, Ambatomainty, Tsiroanomandidy"
                    />
                    <FieldError name="adresse" />
                  </div>
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="ville">
                      Ville <span className="text-terracotta">*</span>
                    </label>
                    <input
                      id="ville"
                      name="ville"
                      type="text"
                      value={fields.ville}
                      onChange={handleField}
                      className={errors.ville ? INPUT_ERR_CLS : INPUT_CLS}
                      placeholder="Antananarivo"
                    />
                    <FieldError name="ville" />
                  </div>
                </div>
                {/* Email + Téléphone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="email">
                      Email <span className="text-terracotta">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={fields.email}
                      onChange={handleField}
                      className={errors.email ? INPUT_ERR_CLS : INPUT_CLS}
                      placeholder="marie@exemple.fr"
                    />
                    <FieldError name="email" />
                  </div>
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="telephone">
                      Mobile{opt}
                    </label>
                    <PhoneInput
                      country="mg"
                      value={fields.telephone}
                      onChange={value => setFields(f => ({ ...f, telephone: value }))}
                      containerClass="w-full"
                      inputProps={{ id: 'telephone', name: 'telephone' }}
                      inputStyle={{ width: '100%', borderColor: '#F5E6C8', color: '#1A1108', fontSize: '0.875rem', fontFamily: '"DM Sans", sans-serif', backgroundColor: '#fff', borderRadius: '0 0.5rem 0.5rem 0' }}
                      buttonStyle={{ borderColor: '#F5E6C8', backgroundColor: '#fff', borderRadius: '0.5rem 0 0 0.5rem' }}
                      enableSearch={true}
                    />
                  </div>
                </div>

                {/* LinkedIn + Site web */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="whatsapp">
                      Whatsapp{opt}
                    </label>
                    <PhoneInput
                      country="mg"
                      value={fields.whatsapp}
                      onChange={value => setFields(f => ({ ...f, whatsapp: value }))}
                      containerClass="w-full"
                      inputProps={{ id: 'whatsapp', name: 'whatsapp' }}
                      inputStyle={{ width: '100%', borderColor: '#F5E6C8', color: '#1A1108', fontSize: '0.875rem', fontFamily: '"DM Sans", sans-serif', backgroundColor: '#fff', borderRadius: '0 0.5rem 0.5rem 0' }}
                      buttonStyle={{ borderColor: '#F5E6C8', backgroundColor: '#fff', borderRadius: '0.5rem 0 0 0.5rem' }}
                      enableSearch={true}
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="fb_account">
                      Compte facebook{opt}
                    </label>
                    <input
                      id="fb_account"
                      name="fb_account"
                      type="url"
                      value={fields.fb_account}
                      onChange={handleField}
                      className={INPUT_CLS}
                      placeholder="Rakoto Malala"
                    />
                  </div>
                </div>
                {/* Bio */}
                <div>
                  <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="bio">
                    Informations complémentaires <span className="text-terracotta">*</span>
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={fields.bio}
                    onChange={handleField}
                    className={errors.bio ? INPUT_ERR_CLS : INPUT_CLS}
                    placeholder="Décrivez votre parcours, vos services, ce que vous pouvez apporter à la communauté..."
                  />
                  <p className="font-sans text-xs text-muted mt-1">Minimum 50 caractères.</p>
                  <FieldError name="bio" />
                </div>
              </div>
            </section>
            {/* ── Section: Contact ── */}
            <section>
              <SectionHeading>Origine</SectionHeading>
              <div className="space-y-4">
                {/* Ville + Région */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="commune">
                      Commune <span className="text-terracotta">*</span>
                    </label>
                    <input
                      id="commune"
                      name="commune"
                      type="text"
                      value={fields.commune}
                      onChange={handleField}
                      className={errors.commune ? INPUT_ERR_CLS : INPUT_CLS}
                      placeholder="Ex : Tsiroanomandidy ville"
                    />
                    <FieldError name="commune" />
                  </div>
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="district">
                      District <span className="text-terracotta">*</span>
                    </label>
                    <input
                      id="district"
                      name="district"
                      type="text"
                      value={fields.district}
                      onChange={handleField}
                      className={INPUT_CLS}
                      placeholder="Ex : Tsiroanomandidy"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ── Section: Identité ── */}
            <section>
              <SectionHeading>Identité professionnelle</SectionHeading>
              <div className="space-y-4">
                {/* Métier + Entreprise */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="metier">
                      Métier / Poste <span className="text-terracotta">*</span>
                    </label>
                    <input
                      id="metier"
                      name="metier"
                      type="text"
                      value={fields.metier}
                      onChange={handleField}
                      className={errors.metier ? INPUT_ERR_CLS : INPUT_CLS}
                      placeholder="Ex : Architecte, Développeur web..."
                    />
                    <FieldError name="metier" />
                  </div>
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="entreprise">
                      Entreprise / Etablissement <span className="text-terracotta">*</span>
                    </label>
                    <input
                      id="entreprise"
                      name="entreprise"
                      type="text"
                      value={fields.entreprise}
                      onChange={handleField}
                      className={INPUT_CLS}
                      placeholder="Ex : Auto-entrepreneur, Cabinet X..."
                    />
                  </div>
                </div>

                {/* Domaine + Expérience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="domaine">
                      Domaine d'expertise <span className="text-terracotta">*</span>
                    </label>
                    <select
                      id="domaine"
                      name="domaine"
                      value={fields.domaine}
                      onChange={handleField}
                      className={errors.domaine ? INPUT_ERR_CLS : INPUT_CLS}
                    >
                      <option value="">-- Choisir --</option>
                      {DOMAINES.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <FieldError name="domaine" />
                  </div>
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="experience">
                      Années d'expérience{opt}
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={fields.experience}
                      onChange={handleField}
                      className={INPUT_CLS}
                    >
                      <option value="">-- Choisir --</option>
                      {EXPERIENCE_OPTIONS.map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="specialite">
                      Spécialité{opt}
                    </label>
                    <textarea
                      id="specialite"
                      name="specialite"
                      rows={3}
                      value={fields.specialite}
                      onChange={handleField}
                      className={errors.specialite ? INPUT_ERR_CLS : INPUT_CLS}
                      placeholder="Décrivez votre spécialité..."
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* ── Section: Identité estudiantine ── */}
            <section>
              <SectionHeading>Identité estudiantine</SectionHeading>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="universite">
                      Université <span className="text-terracotta">*</span>
                    </label>
                    <input
                      id="universite"
                      name="universite"
                      type="text"
                      value={fields.universite}
                      onChange={handleField}
                      className={errors.universite ? INPUT_ERR_CLS : INPUT_CLS}
                      placeholder="Ex : Antananarivo..."
                    />
                    <FieldError name="universite" />
                  </div>
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="etablissement">
                      Etablissement <span className="text-terracotta">*</span>
                    </label>
                    <input
                      id="etablissement"
                      name="etablissement"
                      type="text"
                      value={fields.etablissement}
                      onChange={handleField}
                      className={INPUT_CLS}
                      placeholder="Ex : ESPA, ESSA..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="niveau">
                      Niveau <span className="text-terracotta">*</span>
                    </label>
                    <select
                      id="niveau"
                      name="niveau"
                      value={fields.niveau}
                      onChange={handleField}
                      className={errors.niveau ? INPUT_ERR_CLS : INPUT_CLS}
                    >
                      <option value="">-- Choisir --</option>
                      {NIVEAUX.map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    <FieldError name="niveau" />
                  </div>
                </div>
              </div>
            </section>
          </div>
          {/* end right column */}
        </div>
        {/* end grid */}

        {/* ── Consent + Submit ── */}
        <div className="mt-8 pt-6 border-t border-sand space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="consent"
              checked={fields.consent}
              onChange={handleField}
              className="accent-terracotta mt-0.5 w-4 h-4"
            />
            <span className="font-sans text-sm text-ink leading-relaxed">
              J'accepte que mes informations soient publiées dans l'annuaire de l'association.
            </span>
          </label>
          {errors.consent && (
            <p className="font-sans text-xs text-terracotta">{errors.consent}</p>
          )}

          <div>
            <ReCAPTCHA
              ref={captchaRef}
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              onChange={token => setCaptchaToken(token)}
              onExpired={() => setCaptchaToken(null)}
            />
            {errors.captcha && (
              <p className="font-sans text-xs text-terracotta mt-1">{errors.captcha}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-terracotta text-cream font-sans font-semibold text-sm px-6 py-3 rounded-lg hover:bg-terracotta/90 transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  Envoi...
                </>
              ) : (
                'Soumettre ma candidature'
              )}
            </button>
            <Link
              to="/"
              className="font-sans text-sm text-muted hover:text-ink transition-colors"
            >
              ← Retour à l'annuaire
            </Link>
          </div>
        </div>
      </form>
    </main>
    </>
  );
}

export default InscriptionPage;
