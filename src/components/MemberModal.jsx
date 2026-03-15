import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

function MemberModal({ member: m, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  // Enter animation — paint opacity-0/scale-95 first, then transition to full
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Body scroll lock
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, []);

  // Escape key handler
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Initials fallback
  const initials = ((m.prenom || '?')[0] + (m.nom || '?')[0]).toUpperCase();

  // Drive's /uc and /thumbnail URLs redirect → ORB blocks them in-app.
  // lh3.googleusercontent.com/d/FILE_ID is the direct CDN URL — no redirect, no ORB.
  function driveThumb(url) {
    if (!url) return null;
    const match = url.match(/(?:\/d\/|[?&]id=)([\w-]+)/);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  }

  return ReactDOM.createPortal(
    // Overlay — closes modal on click
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-300 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      {/* Modal card — stops propagation so clicking inside does not close */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-muted hover:text-ink transition-colors p-1 rounded"
          aria-label="Fermer"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        {/* Portrait header — avatar, name, title, company, availability */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          {/* Photo avatar — 96px circle */}
          <div className="w-24 h-24 rounded-full overflow-hidden bg-sand flex items-center justify-center mb-4 ring-4 ring-sand">
            {m.photo_url
              ? <img src={driveThumb(m.photo_url)} alt={`${m.prenom} ${m.nom}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              : <span className="font-serif text-3xl text-muted">{initials}</span>
            }
          </div>
          {/* Name */}
          <p className="font-serif text-xl font-bold text-ink text-center">{m.prenom} {m.nom}</p>
          {/* Metier */}
          {m.metier && <p className="font-sans text-sm text-muted text-center mt-0.5">{m.metier}</p>}
          {/* Entreprise */}
          {m.entreprise && <p className="font-sans text-xs text-muted text-center mt-0.5">{m.entreprise}</p>}
        </div>

        <hr className="border-sand mx-6" />

        {/* Content sections */}
        <div className="px-6 py-4 flex flex-col gap-4">
          {/* Bio — full, no line-clamp */}
          {m.bio && (
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-wide text-muted mb-1.5">À propos</p>
              <p className="font-sans text-sm text-ink leading-relaxed">{m.bio}</p>
            </div>
          )}

          {/* Informations personnelles */}
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-wide text-muted mb-2 border-b border-sand">Informations personnelles</p>
            <div className="flex flex-col gap-1.5">
              {[
                { label: 'Adresse',        value: m.adresse },
                { label: 'Age',        value: m.age },
                { label: 'Sexe',       value: m.sex },
                { label: 'Ville',   value: m.ville || null },
              ].map(({ label, value }) => value ? (
                <div key={label} className="flex gap-2 font-sans text-sm">
                  <span className="text-muted shrink-0 w-28">{label}</span>
                  <span className="text-ink">{value}</span>
                </div>
              ) : null)}
            </div>
          </div>
          {/* Origine */}
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-wide text-muted mb-2 border-b border-sand">Origine</p>
            <div className="flex flex-col gap-1.5">
              {[
                { label: 'commune',        value: m.commune },
                { label: 'District',        value: m.district }
              ].map(({ label, value }) => value ? (
                <div key={label} className="flex gap-2 font-sans text-sm">
                  <span className="text-muted shrink-0 w-28">{label}</span>
                  <span className="text-ink">{value}</span>
                </div>
              ) : null)}
            </div>
          </div>
          {/* Informations professionnelles */}
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-wide text-muted mb-2 border-b border-sand">Informations professionnelles</p>
            <div className="flex flex-col gap-1.5">
              {[
                { label: 'Domaine',        value: m.domaine },
                { label: 'Localisation',   value: m.ville || null },
                { label: 'Expérience',     value: m.experience },
                { label: 'Spécialité',     value: m.specialite }
              ].map(({ label, value }) => value ? (
                <div key={label} className="flex gap-2 font-sans text-sm">
                  <span className="text-muted shrink-0 w-28">{label}</span>
                  <span className="text-ink">{value}</span>
                </div>
              ) : null)}
            </div>
          </div>

          {/* Informations estudiantines */}
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-wide text-muted mb-2 border-b border-sand">Informations estudiantines</p>
            <div className="flex flex-col gap-1.5">
              {[
                { label: 'Université',        value: m.universite },
                { label: 'Etablissement',   value: m.etablissement },
                { label: 'Niveau',     value: m.niveau }
              ].map(({ label, value }) => value ? (
                <div key={label} className="flex gap-2 font-sans text-sm">
                  <span className="text-muted shrink-0 w-28">{label}</span>
                  <span className="text-ink">{value}</span>
                </div>
              ) : null)}
            </div>
          </div>

          {/* Social links */}
          {(m.fb_account || m.whatsapp) && (
            <div className="flex gap-4">
              {m.fb_account && (
                  <>
                    <FontAwesomeIcon icon={faFacebook} />
                    <span>{m.fb_account}</span>
                  </>
              )}
              {m.whatsapp && (
                <>
                  <FontAwesomeIcon icon={faWhatsapp} />
                  <span>{m.whatsapp}</span>
                </>
              )}
            </div>
          )}

          {/* Contact buttons */}
          {(m.email || m.telephone) && (
            <div className="flex gap-3 pt-2 pb-2">
              {m.email && (
                <a
                  href={`mailto:${m.email}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-terracotta text-cream font-sans text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>Email</span>
                </a>
              )}
              {m.telephone && (
                <a
                  href={`tel:${m.telephone}`}
                  className="flex-1 flex items-center justify-center gap-2 border border-terracotta text-terracotta font-sans text-sm font-semibold py-2.5 rounded-lg hover:bg-terracotta/5 transition-colors"
                >
                  <FontAwesomeIcon icon={faPhone} />
                  <span>Appeler</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default MemberModal;
