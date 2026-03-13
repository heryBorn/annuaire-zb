function getAvailStyle(d) {
  if (!d) return 'grey';
  if (d.includes('Disponible') && !d.includes('Partiel')) return 'green';
  if (d.includes('Partiel') || d.includes('Recherche')) return 'orange';
  return 'grey';
}

const badgeConfig = {
  green:  { dot: 'bg-sage',  bg: 'bg-sage/20',  label: 'Disponible'    },
  orange: { dot: 'bg-wheat', bg: 'bg-wheat/20', label: 'Partiellement'  },
  grey:   { dot: 'bg-muted', bg: 'bg-muted/20', label: 'Non disponible' },
};

function AvailabilityBadge({ disponibilite }) {
  const key = getAvailStyle(disponibilite);
  const { dot, bg, label } = badgeConfig[key];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-sans font-medium ${bg} mt-2`}>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
      {label}
    </span>
  );
}

export default AvailabilityBadge;
