import { useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import MemberCard from '../components/MemberCard';
import SkeletonCard from '../components/SkeletonCard';

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

function StatInline({ value, label }) {
  return (
    <div className="text-center">
      <p className="font-serif text-3xl font-bold text-soil">{value}</p>
      <p className="font-sans text-xs text-muted mt-0.5 uppercase tracking-wide">{label}</p>
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
  // Filter form state (live — what the user sees in the inputs)
  const [query,         setQuery]         = useState('');
  const [filterDomaine, setFilterDomaine] = useState('');
  const [filterVille,   setFilterVille]   = useState('');
  const [filterDispo,   setFilterDispo]   = useState('');
  const [filterService, setFilterService] = useState('');

  // Search result state (explicit — only changes when a fetch completes)
  const [phase,   setPhase]   = useState('idle'); // 'idle' | 'loading' | 'done' | 'error'
  const [members, setMembers] = useState([]);
  const [results, setResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const fetchId = useRef(0);

  const stats = useMemo(() => deriveStats(members), [members]);

  const cities = useMemo(
    () => [...new Set(members.map(m => m.ville).filter(Boolean))].sort(),
    [members]
  );

  async function runSearch() {
    const id = ++fetchId.current;

    // Force immediate DOM flush — clears results and shows skeletons before fetch starts
    flushSync(() => {
      setPhase('loading');
      setResults([]);
      setMembers([]);
    });

    // Snapshot filter values at click time — avoids stale-closure issues
    const snap = {
      q:       query.trim().toLowerCase(),
      domaine: filterDomaine,
      ville:   filterVille,
      dispo:   filterDispo,
      service: filterService,
    };

    try {
      const url = process.env.REACT_APP_SHEET_API_URL + '?action=getMembers';
      const res = await fetch(url);
      const data = await res.json();
      if (id !== fetchId.current) return; // stale — a newer search was started
      const all = data.members || [];
      setMembers(all);
      setResults(applyFilters(all, snap));
      setPhase('done');
    } catch (err) {
      if (id !== fetchId.current) return;
      setErrorMsg(err.message);
      setPhase('error');
    }
  }

  function resetSearch() {
    fetchId.current++;          // cancel any in-flight fetch
    setQuery('');
    setFilterDomaine('');
    setFilterVille('');
    setFilterDispo('');
    setFilterService('');
    setPhase('idle');
    setMembers([]);
    setResults([]);
    setErrorMsg('');
  }

  const hasFilters =
    query.trim() !== '' || filterDomaine !== '' || filterVille !== '' ||
    filterDispo !== '' || filterService !== '';

  return (
    <main className="px-6 py-8 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight">
          Trouvez les <em>talents</em><br />de notre région
        </h1>
        <p className="font-sans text-sm text-muted mt-3 max-w-lg mx-auto">
          Découvrez les compétences et savoir-faire de vos voisins. Recherchez un membre par domaine, localité ou disponibilité.
        </p>
        <div className="flex justify-center gap-8 mt-6">
          <StatInline value={phase === 'idle' ? '—' : stats.total}   label="Membres" />
          <StatInline value={phase === 'idle' ? '—' : stats.domains} label="Domaines" />
          <StatInline value={phase === 'idle' ? '—' : stats.villes}  label="Villes" />
        </div>
      </div>

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
              onKeyDown={e => { if (e.key === 'Enter') runSearch(); }}
              placeholder="Rechercher un nom, métier, compétence..."
              className="w-full pl-9 pr-3 py-2 border border-sand rounded-lg font-sans text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-terracotta/40"
            />
          </div>
          <button
            onClick={runSearch}
            className="bg-terracotta text-cream font-sans text-sm font-semibold px-5 py-2 rounded-lg shrink-0 hover:opacity-90 transition-opacity"
          >
            Rechercher
          </button>
        </div>

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

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {phase === 'error'
          ? <ErrorState message={errorMsg} />
          : phase === 'loading'
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : phase === 'idle'
              ? <EmptyPrompt />
              : results.length === 0
                ? <NoResults />
                : results.map(m => <MemberCard key={m.email || m.nom} member={m} />)
        }
      </div>
    </main>
  );
}

export default DirectoryPage;
