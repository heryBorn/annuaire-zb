import { useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import MemberCard from '../components/MemberCard';
import MemberModal from '../components/MemberModal';
import SkeletonCard from '../components/SkeletonCard';
import { useMemberFetch } from '../hooks/useMemberFetch';

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

const SELECT_CLS = 'border border-sand rounded-lg font-sans text-sm text-ink px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terracotta/40 bg-white';

function applyFilters(members, { q, domaine, ville, dispo, service }) {
  return members.filter(m => {
    const text = [m.nom, m.prenom, m.metier, m.bio, m.competences, m.entreprise]
      .join(' ').toLowerCase();
    if (q      && !text.includes(q))                               return false;
    if (domaine && m.domaine      !== domaine)                      return false;
    if (ville   && m.ville        !== ville)                        return false;
    return true;
  });
}

function deriveStats(members) {
  return {
    total:      members.length,
    domains:    new Set(members.map(m => m.domaine).filter(Boolean)).size
  };
}

function StatChip({ value, label }) {
  return (
    <div className="text-center">
      <p className="font-serif text-3xl sm:text-4xl font-bold text-cream">{value}</p>
      <p className="font-sans text-xs text-cream/60 mt-0.5 uppercase tracking-wide">{label}</p>
    </div>
  );
}

function EmptyPrompt() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <p className="text-4xl mb-4">🔎</p>
      <p className="font-serif text-2xl text-ink">Effectuez une recherche</p>
      <p className="font-sans text-sm text-muted mt-2 max-w-sm">
        Utilisez les filtres ci-dessus pour trouver un membre par nom, domaine ou ville.
        Les résultats s'affichent uniquement après une recherche.
      </p>
    </div>
  );
}

function NoResults() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <p className="text-4xl mb-4">😕</p>
      <p className="font-serif text-xl text-muted">Aucun membre trouvé</p>
      <p className="font-sans text-sm text-muted mt-2">Essayez de modifier ou d'élargir les filtres.</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <p className="font-serif text-xl text-terracotta">Impossible de charger l'annuaire</p>
      <p className="font-sans text-sm text-muted mt-2">{message}</p>
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

function DirectoryPage() {
  const [trigger] = useState(1);
  const { members, loading, error } = useMemberFetch({ trigger });

  // Live filter inputs
  const [query,         setQuery]         = useState('');
  const [filterDomaine, setFilterDomaine] = useState('');
  const [filterVille,   setFilterVille]   = useState('');
  const [filterOpen,    setFilterOpen]    = useState(false);
  const [page,          setPage]          = useState(1);

  const PAGE_SIZE = 20;

  // status: 'idle' | 'done'
  const [search,    setSearch]    = useState({ status: 'idle', results: [] });
  const [busy,      setBusy]      = useState(false);
  const timerRef = useRef(null);

  const [selectedMember, setSelectedMember] = useState(null);

  const stats = useMemo(() => deriveStats(members), [members]);

  const cities = useMemo(
    () => [...new Set(members.map(m => m.ville).filter(Boolean))].sort(),
    [members]
  );

  function handleSearch() {
    const q = query.trim().toLowerCase();
    const hasFilters = q || filterDomaine || filterVille ;
    if (!hasFilters) return;
    const results = applyFilters(members, {
      q,
      domaine: filterDomaine,
      ville:   filterVille,
    });
    setBusy(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSearch({ status: 'done', results });
      setPage(1);
      setBusy(false);
    }, 800);
  }

  function resetSearch() {
    clearTimeout(timerRef.current);
    setBusy(false);
    setQuery('');
    setFilterDomaine('');
    setFilterVille('');
    setSearch({ status: 'idle', results: [] });
    setPage(1);
    setSelectedMember(null);
  }

  const hasFilters =
    query.trim() !== '' || filterDomaine !== '' || filterVille !== '';

  return (
    <>
      {/* Hero — full-bleed bg-soil band, outside max-w container */}
      <section
        className="text-cream pt-24 pb-10 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #2C1A0E 0%, #3A2010 50%, #5A2E10 100%)' }}
      >
        {/* Radial accent overlays */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(232,201,122,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(193,68,14,0.1) 0%, transparent 40%)'
        }} />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <span className="inline-block font-sans text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-5" style={{ background: 'rgba(232,201,122,0.15)', border: '1px solid rgba(232,201,122,0.3)', color: '#E8C97A' }}>
            Annuaire
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream leading-tight">
            Trouvez les <em className="text-wheat italic">membres</em><br className="hidden sm:block" /> de notre association
          </h1>
          <p className="font-sans text-sm text-cream/70 mt-3 max-w-lg mx-auto">
            Découvrez les profils, compétences Recherchez et expérience de nos membres. Recherchez un membre par domaine, ville ou spécialité.
          </p>
          <div className="flex justify-center gap-8 sm:gap-12 mt-6">
            <StatChip value={loading ? '…' : stats.total}        label="Membres" />
            <StatChip value={loading ? '…' : stats.domains}      label="Domaines" />
          </div>
        </div>
      </section>

      {/* Page content */}
      <main className="px-6 py-8 max-w-7xl mx-auto">
        {/* Search panel */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none"
            />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              placeholder="Rechercher un nom, métier, compétence..."
              className="w-full pl-9 pr-3 py-2 border border-sand rounded-lg font-sans text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-terracotta/40"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-terracotta text-cream font-sans text-sm font-semibold px-5 py-2 rounded-lg shrink-0 hover:opacity-90 transition-opacity"
          >
            Rechercher
          </button>
        </div>

        {/* Mobile filter toggle — hidden on md+ */}
        <button
          className="md:hidden flex items-center gap-2 font-sans text-sm text-ink border border-sand rounded-lg px-4 py-2 w-full justify-between mt-3"
          onClick={() => setFilterOpen(o => !o)}
          aria-expanded={filterOpen}
          aria-controls="filter-panel"
        >
          <span>Filtrer</span>
          <FontAwesomeIcon
            icon={filterOpen ? faChevronUp : faChevronDown}
            className="text-muted text-xs"
          />
        </button>

        {/* Filter panel — collapsible on mobile, always open on md+ */}
        <div
          id="filter-panel"
          className={`overflow-hidden transition-all duration-200 ease-out md:overflow-visible md:max-h-none ${
            filterOpen ? 'max-h-96' : 'max-h-0'
          }`}
        >
          <div className="flex flex-wrap gap-2 mt-3">
            <select value={filterDomaine} onChange={e => setFilterDomaine(e.target.value)} className={SELECT_CLS}>
              <option value="">🗂 Tous les domaines</option>
              {DOMAINES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <select value={filterVille} onChange={e => setFilterVille(e.target.value)} className={SELECT_CLS}>
              <option value="">📍 Toutes les villes</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {hasFilters && (
              <button
                onClick={resetSearch}
                className="flex items-center gap-1.5 border border-sand rounded-lg font-sans text-sm text-muted px-3 py-2 hover:text-terracotta transition-colors"
              >
                <FontAwesomeIcon icon={faXmark} />
                Effacer filtres
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Skeleton grid — completely separate DOM node, only mounted when busy/loading */}
      {(loading || busy) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Results grid — completely separate DOM node, only mounted when not busy */}
      {!loading && !busy && (() => {
        if (error) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><ErrorState message={error} /></div>;
        if (search.status === 'idle') return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><EmptyPrompt /></div>;
        if (search.results.length === 0) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><NoResults /></div>;

        const totalPages = Math.ceil(search.results.length / PAGE_SIZE);
        const pageItems  = search.results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pageItems.map((m, index) => (
                <div
                  key={m.email || m.nom}
                  className="animate-fade-slide-up"
                  style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
                >
                  <MemberCard member={m} onClick={() => setSelectedMember(m)} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="font-sans text-sm px-4 py-2 rounded-lg border border-sand text-ink disabled:opacity-40 hover:bg-sand/60 transition-colors"
                >
                  ← Précédent
                </button>
                <span className="font-sans text-sm text-muted">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="font-sans text-sm px-4 py-2 rounded-lg border border-sand text-ink disabled:opacity-40 hover:bg-sand/60 transition-colors"
                >
                  Suivant →
                </button>
              </div>
            )}
          </>
        );
      })()}
      {selectedMember && (
        <MemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
      </main>
    </>
  );
}

export default DirectoryPage;
