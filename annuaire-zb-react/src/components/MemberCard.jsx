import AvailabilityBadge from './AvailabilityBadge';

function MemberCard({ member: m }) {
  const initials = ((m.prenom || '?')[0] + (m.nom || '?')[0]).toUpperCase();

  return (
    <div className="
      rounded-xl overflow-hidden shadow-md bg-white cursor-pointer
      transition-all duration-200 ease-out
      hover:shadow-xl hover:scale-[1.02]
    ">
      {/* Square photo — aspect-square ensures consistent card height regardless of image dimensions */}
      <div className="w-full aspect-square overflow-hidden bg-sand flex items-center justify-center">
        {m.photo_url
          ? <img src={m.photo_url} alt={`${m.prenom} ${m.nom}`} className="w-full h-full object-cover" />
          : <span className="font-serif text-3xl text-muted">{initials}</span>
        }
      </div>

      {/* Info stacked below photo: name → title → company → badge */}
      <div className="p-4">
        <p className="font-serif font-semibold text-ink leading-tight">
          {m.prenom} {m.nom}
        </p>
        <p className="font-sans text-sm text-muted mt-0.5 truncate">
          {m.metier || '\u00A0'}
        </p>
        <p className="font-sans text-sm text-muted truncate">
          {m.entreprise || '\u00A0'}
        </p>
        <AvailabilityBadge disponibilite={m.disponibilite} />
      </div>
    </div>
  );
}

export default MemberCard;
