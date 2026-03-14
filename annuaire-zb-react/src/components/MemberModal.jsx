import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faGlobe, faEnvelope, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import AvailabilityBadge from './AvailabilityBadge';

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

  // Competences derivation — handles comma-separated string, array, or absent
  const pills = (() => {
    const raw = m.competences || m.skills || '';
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.filter(Boolean);
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  })();

  // Site web URL normalization
  const siteUrl = m.site_web
    ? (m.site_web.startsWith('http') ? m.site_web : `https://${m.site_web}`)
    : null;

  // Initials fallback
  const initials = ((m.prenom || '?')[0] + (m.nom || '?')[0]).toUpperCase();

  return ReactDOM.createPortal(
    // Overlay — closes modal on click
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity duration-200 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      {/* Modal card — stops propagation so clicking inside does not close */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto transition-all duration-200 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
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
              ? <img src={m.photo_url} alt={`${m.prenom} ${m.nom}`} className="w-full h-full object-cover" />
              : <span className="font-serif text-3xl text-muted">{initials}</span>
            }
          </div>
          {/* Name */}
          <p className="font-serif text-xl font-bold text-ink text-center">{m.prenom} {m.nom}</p>
          {/* Metier */}
          {m.metier && <p className="font-sans text-sm text-muted text-center mt-0.5">{m.metier}</p>}
          {/* Entreprise */}
          {m.entreprise && <p className="font-sans text-xs text-muted text-center mt-0.5">{m.entreprise}</p>}
          {/* Availability badge */}
          {m.disponibilite && (
            <div className="mt-3">
              <AvailabilityBadge disponibilite={m.disponibilite} />
            </div>
          )}
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

          {/* Competences pills */}
          {pills.length > 0 && (
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-wide text-muted mb-1.5">Compétences</p>
              <div className="flex flex-wrap gap-1.5">
                {pills.map(skill => (
                  <span key={skill} className="bg-sand text-ink font-sans text-xs px-2.5 py-0.5 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Localisation */}
          {(m.ville || m.region) && (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faLocationDot} className="text-terracotta shrink-0 text-sm" />
              <p className="font-sans text-sm text-ink">
                {[m.ville, m.region].filter(Boolean).join(', ')}
              </p>
            </div>
          )}

          {/* Social links */}
          {(m.linkedin || siteUrl) && (
            <div className="flex gap-4">
              {m.linkedin && (
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-sans text-sm text-muted hover:text-terracotta transition-colors"
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                  <span>LinkedIn</span>
                </a>
              )}
              {siteUrl && (
                <a
                  href={siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-sans text-sm text-muted hover:text-terracotta transition-colors"
                >
                  <FontAwesomeIcon icon={faGlobe} />
                  <span>Site web</span>
                </a>
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
