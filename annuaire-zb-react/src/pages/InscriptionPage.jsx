import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';

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
  'Éducation & Formation',
  'Finance & Comptabilité',
  'Informatique & Tech',
  'Médical & Paramédical',
  'Restauration & Hôtellerie',
  'Services à la personne',
  'Sport & Bien-être',
  'Transport & Logistique',
  'Autre',
];

const EXPERIENCE_OPTIONS = [
  'Moins de 2 ans',
  '2 – 5 ans',
  '5 – 10 ans',
  '10 – 20 ans',
  'Plus de 20 ans',
];

const DISPONIBILITE_OPTIONS = [
  'Disponible (actif)',
  'Partiellement disponible',
  'Non disponible (en poste)',
  "À la recherche d'opportunités",
];

const TYPE_SERVICE_OPTIONS = [
  'Emploi / Recrutement',
  'Mission freelance',
  'Bénévolat / Entraide',
  'Vente de produits / services',
  'Partenariat',
];

const SKILLS_OPTIONS = [
  'Gestion de projet',
  'Design graphique',
  'Développement web',
  'Comptabilité',
  'Droit',
  'Agriculture bio',
  'Menuiserie',
  'Électricité',
  'Plomberie',
  'Cuisine',
  'Couture',
  'Médecine',
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
    email: '',
    telephone: '',
    ville: '',
    region: '',
    metier: '',
    entreprise: '',
    domaine: '',
    experience: '',
    bio: '',
    site_web: '',
    linkedin: '',
    disponibilite: '',
    type_service: '',
    competences: [],
    consent: false,
  });
  const [errors, setErrors] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [photoBase64, setPhotoBase64] = useState('');
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [submitted, setSubmitted] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [toast, setToast] = useState(null);
  const photoInputRef = useRef(null);

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleField(e) {
    const { name, value, type, checked } = e.target;
    setFields(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleSkillToggle(skill) {
    setFields(f => {
      const current = f.competences;
      const next = current.includes(skill)
        ? current.filter(s => s !== skill)
        : [...current, skill];
      return { ...f, competences: next };
    });
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
    // TODO: validation and submit — wired in Plan 02
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

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-soil mb-2">Rejoignez l'annuaire</h1>
        <p className="font-sans text-sm text-muted leading-relaxed">
          Renseignez vos informations. Votre fiche sera examinée par le président avant publication.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Two-column grid: photo sidebar | fields */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">

          {/* ── Left column: photo zone ── */}
          <div className="flex flex-col items-center md:items-start">
            <label className="font-sans text-xs font-semibold text-ink mb-2 block">
              Photo de profil{opt}
            </label>

            {/* Photo zone */}
            <div
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
              <SectionHeading>Identité</SectionHeading>
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
                      placeholder="Marie"
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
                      placeholder="Dupont"
                    />
                    <FieldError name="nom" />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="bio">
                    Présentation / Bio <span className="text-terracotta">*</span>
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

            {/* ── Section: Activité ── */}
            <section>
              <SectionHeading>Activité professionnelle</SectionHeading>
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
                      Entreprise / Statut{opt}
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

                {/* Disponibilité + Type service */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="disponibilite">
                      Disponibilité{opt}
                    </label>
                    <select
                      id="disponibilite"
                      name="disponibilite"
                      value={fields.disponibilite}
                      onChange={handleField}
                      className={INPUT_CLS}
                    >
                      <option value="">-- Choisir --</option>
                      {DISPONIBILITE_OPTIONS.map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="type_service">
                      Type de service proposé{opt}
                    </label>
                    <select
                      id="type_service"
                      name="type_service"
                      value={fields.type_service}
                      onChange={handleField}
                      className={INPUT_CLS}
                    >
                      <option value="">-- Choisir --</option>
                      {TYPE_SERVICE_OPTIONS.map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Compétences checkboxes */}
                <div>
                  <p className="font-sans text-xs font-semibold text-ink mb-2">
                    Compétences clés{opt}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SKILLS_OPTIONS.map(skill => (
                      <label
                        key={skill}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={fields.competences.includes(skill)}
                          onChange={() => handleSkillToggle(skill)}
                          className="accent-terracotta w-4 h-4 rounded"
                        />
                        <span className="font-sans text-xs text-ink leading-tight">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── Section: Contact ── */}
            <section>
              <SectionHeading>Contact &amp; localisation</SectionHeading>
              <div className="space-y-4">
                {/* Ville + Région */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="ville">
                      Ville / Village <span className="text-terracotta">*</span>
                    </label>
                    <input
                      id="ville"
                      name="ville"
                      type="text"
                      value={fields.ville}
                      onChange={handleField}
                      className={errors.ville ? INPUT_ERR_CLS : INPUT_CLS}
                      placeholder="Ex : Saint-Martin"
                    />
                    <FieldError name="ville" />
                  </div>
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="region">
                      Département / Région{opt}
                    </label>
                    <input
                      id="region"
                      name="region"
                      type="text"
                      value={fields.region}
                      onChange={handleField}
                      className={INPUT_CLS}
                      placeholder="Ex : Occitanie"
                    />
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
                      Téléphone{opt}
                    </label>
                    <input
                      id="telephone"
                      name="telephone"
                      type="tel"
                      value={fields.telephone}
                      onChange={handleField}
                      className={INPUT_CLS}
                      placeholder="+33 6 00 00 00 00"
                    />
                  </div>
                </div>

                {/* LinkedIn + Site web */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="linkedin">
                      LinkedIn{opt}
                    </label>
                    <input
                      id="linkedin"
                      name="linkedin"
                      type="url"
                      value={fields.linkedin}
                      onChange={handleField}
                      className={INPUT_CLS}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs font-semibold text-ink mb-1 block" htmlFor="site_web">
                      Site web / Portfolio{opt}
                    </label>
                    <input
                      id="site_web"
                      name="site_web"
                      type="url"
                      value={fields.site_web}
                      onChange={handleField}
                      className={INPUT_CLS}
                      placeholder="https://monsite.fr"
                    />
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
  );
}

export default InscriptionPage;
