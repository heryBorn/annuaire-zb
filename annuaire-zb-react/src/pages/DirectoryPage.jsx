import { useMemo, useState } from 'react';
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

const DISPOS = [
  { value: 'Disponible',     label: 'Disponible' },
  { value: 'Partiellement',  label: 'Partiellement disponible' },
  { value: 'Non disponible', label: 'Non disponible' },
  { value: 'Recherche',      label: 'En recherche' },
];

const SERVICES = [
  'Emploi / Recrutement',
  'Mission freelance',
  'Bénévolat / Entraide',
  'Vente de produits / services',
  'Partenariat',
];

const SELECT_CLS = 'border border-sand rounded-lg font-sans text-sm text-ink px-3 py-2 focus:outline-none focus:ring-2 focus:ring-terracotta/40 bg-white';

function applyFilters(members, { q, domaine, ville, dispo, service }) {
  return members.filter(m => {
    const text = [m.nom, m.prenom, m.metier, m.bio, m.competences, m.entreprise]
      .join(' ').toLowerCase();
    if (q      && !text.includes(q))                               return false;
    if (domaine && m.domaine      !== domaine)                      return false;
    if (ville   && m.ville        !== ville)                        return false;
    if (dispo   && !(m.disponibilite || '').includes(dispo))        return false;
    if (service && m.type_service !== service)                      return false;
    return true;
  });
}

function deriveStats(members) {
  return {
    total:   members.length,
    domains: new Set(members.map(m => m.domaine).filter(Boolean)).size,
    villes:  new Set(members.map(m => m.ville).filter(Boolean)).size,
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

  // Live filter inputs (controlled — change freely without affecting results)
  const [query,          setQuery]          = useState('');
  const [filterDomaine,  setFilterDomaine]  = useState('');
  const [filterVille,    setFilterVille]    = useState('');
  const [filterDispo,    setFilterDispo]    = useState('');
  const [filterService,  setFilterService]  = useState('');
  const [filterOpen,     setFilterOpen]     = useState(false);

  // Committed filter values — only update on "Rechercher" click
  const [committed, setCommitted] = useState(null);
  const [searching,  setSearching]  = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const hasSearched = committed !== null;

  const filteredResults = useMemo(() => {
    if (!hasSearched || loading || searching) return [];
    return applyFilters(members, {
      q:       committed.q,
      domaine: committed.domaine,
      ville:   committed.ville,
      dispo:   committed.dispo,
      service: committed.service,
    });
  }, [members, committed, hasSearched, loading, searching]);

  const stats = useMemo(() => deriveStats(members), [members]);

  const cities = useMemo(
    () => [...new Set(members.map(m => m.ville).filter(Boolean))].sort(),
    [members]
  );

  function handleSearch() {
    setSearching(true);
    setTimeout(() => {
      setCommitted({
        q:       query.trim().toLowerCase(),
        domaine: filterDomaine,
        ville:   filterVille,
        dispo:   filterDispo,
        service: filterService,
      });
      setSearching(false);
    }, 800);
  }

  function resetSearch() {
    setQuery('');
    setFilterDomaine('');
    setFilterVille('');
    setFilterDispo('');
    setFilterService('');
    setCommitted(null);
    setSearching(false);
    setSelectedMember(null);
  }

  const hasFilters =
    query.trim() !== '' || filterDomaine !== '' || filterVille !== '' ||
    filterDispo !== '' || filterService !== '';

  return (
    <>
      {/* Hero — full-bleed bg-soil band, outside max-w container */}
      <section className="bg-soil text-cream pt-24 pb-10 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream leading-tight">
            Annuaire Zanak'i Bongolava
          </h1>
          <p className="font-sans text-sm text-cream/70 mt-3 max-w-lg mx-auto">
            Découvrez les compétences et savoir-faire de vos voisins.
          </p>
          <div className="flex justify-center gap-8 sm:gap-12 mt-6">
            <StatChip value={loading ? '…' : stats.total}   label="Membres" />
            <StatChip value={loading ? '…' : stats.domains} label="Domaines" />
            <StatChip value={loading ? '…' : stats.villes}  label="Villes" />
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

            <select value={filterDispo} onChange={e => setFilterDispo(e.target.value)} className={SELECT_CLS}>
              <option value="">🟢 Toute disponibilité</option>
              {DISPOS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>

            <select value={filterService} onChange={e => setFilterService(e.target.value)} className={SELECT_CLS}>
              <option value="">💼 Tout type de service</option>
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
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

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {error
          ? <ErrorState message={error} />
          : (loading || searching)
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : !hasSearched
              ? <EmptyPrompt />
              : filteredResults.length === 0
                ? <NoResults />
                : filteredResults.map((m, index) => (
                    <div
                      key={m.email || m.nom}
                      className="animate-fade-slide-up"
                      style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
                    >
                      <MemberCard
                        member={m}
                        onClick={() => setSelectedMember(m)}
                      />
                    </div>
                  ))
        }
      </div>
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
