import { useMemo } from 'react';
import { useMemberFetch } from '../hooks/useMemberFetch';
import MemberCard from '../components/MemberCard';
import SkeletonCard from '../components/SkeletonCard';

function deriveStats(members) {
  const total   = members.length;
  const domains = new Set(members.map(m => m.domaine).filter(Boolean)).size;
  const avail   = members.filter(m =>
    m.disponibilite && m.disponibilite.includes('Disponible')
  ).length;
  return { total, domains, avail };
}

function StatCard({ value, label }) {
  return (
    <div className="bg-white rounded-xl shadow-sm px-6 py-4 text-center">
      <p className="font-serif text-3xl font-bold text-soil">{value}</p>
      <p className="font-sans text-sm text-muted mt-1">{label}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <p className="font-serif text-2xl text-muted">Aucun membre trouvé</p>
      <p className="font-sans text-sm text-muted mt-2">L'annuaire est vide pour le moment.</p>
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

function DirectoryPage() {
  const { members, loading, error } = useMemberFetch();
  const stats = useMemo(() => deriveStats(members), [members]);

  return (
    <main className="px-6 py-8 max-w-7xl mx-auto">
      {/* Stats bar — shows 0s while loading, live values after fetch */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard value={stats.total}   label="membres" />
        <StatCard value={stats.domains} label="domaines" />
        <StatCard value={stats.avail}   label="disponibles" />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {error
          ? <ErrorState message={error} />
          : loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : members.length === 0
              ? <EmptyState />
              : members.map(m => <MemberCard key={m.email || m.nom} member={m} />)
        }
      </div>
    </main>
  );
}

export default DirectoryPage;
