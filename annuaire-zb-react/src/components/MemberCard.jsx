import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

function MemberCard({ member: m, onClick }) {
  const initials = ((m.prenom || '?')[0] + (m.nom || '?')[0]).toUpperCase();

  return (
    <div
      className="rounded-xl overflow-hidden shadow-md bg-white cursor-pointer flex flex-col transition-all duration-200 ease-out hover:shadow-xl hover:scale-[1.02]"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
    >
      {/* Photo — fixed height, smaller than full-square */}
      <div className="w-full h-40 overflow-hidden bg-sand flex items-center justify-center shrink-0">
        {m.photo_url
          ? <img src={m.photo_url} alt={`${m.prenom} ${m.nom}`} className="w-full h-full object-cover" />
          : <span className="font-serif text-3xl text-muted">{initials}</span>
        }
      </div>

      {/* Card body */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        {/* Domaine badge */}
        {m.domaine && (
          <span className="inline-block self-start bg-sand text-ink font-sans text-xs font-medium px-2.5 py-0.5 rounded-full">
            {m.domaine}
          </span>
        )}

        {/* Name */}
        <p className="font-serif font-semibold text-ink leading-tight">
          {m.prenom} {m.nom}
        </p>

        {/* Localisation — ville + region */}
        {(m.ville || m.region) && (
          <p className="font-sans text-xs text-muted flex items-center gap-1">
            <FontAwesomeIcon icon={faLocationDot} className="text-terracotta shrink-0" />
            <span className="truncate">
              {[m.ville, m.region].filter(Boolean).join(', ')}
            </span>
          </p>
        )}

        {/* Bio — truncated to 2 lines */}
        {m.bio && (
          <p className="font-sans text-xs text-muted line-clamp-3 leading-relaxed">
            {m.bio}
          </p>
        )}
      </div>

      {/* Footer — email + phone links */}
      {(m.email || m.telephone || m.linkedin) && (
        <div className="border-t border-sand px-4 py-3 flex justify-center gap-4 shrink-0">
          {m.email && (
            <a
              href={`mailto:${m.email}`}
              className="text-muted hover:text-terracotta transition-colors flex items-center gap-1.5 font-sans text-xs"
              onClick={e => e.stopPropagation()}
              title={m.email}
            >
              <FontAwesomeIcon icon={faEnvelope} />
              <span>Email</span>
            </a>
          )}
          {m.telephone && (
            <a
              href={`tel:${m.telephone}`}
              className="text-muted hover:text-terracotta transition-colors flex items-center gap-1.5 font-sans text-xs"
              onClick={e => e.stopPropagation()}
              title={m.telephone}
            >
              <FontAwesomeIcon icon={faPhone} />
              <span>Appeler</span>
            </a>
          )}
          {m.linkedin && (
            <a
              href={m.linkedin}
              className="text-muted hover:text-terracotta transition-colors flex items-center gap-1.5 font-sans text-xs"
              onClick={e => e.stopPropagation()}
              title={m.linkedin}
            >
              <FontAwesomeIcon icon={faLinkedin} />
              <span>LinkedIn</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default MemberCard;
