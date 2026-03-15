import { Link, useLocation } from 'react-router-dom';

function Header() {
  const { pathname } = useLocation();
  const onInscription = pathname === '/inscription';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-soil shadow-md">
      <div className="h-full flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src="/images/logo_zb_trans.png" alt="ZB" className="h-14 sm:h-16" />
          <div className="flex flex-col leading-tight">
            <span className="font-serif font-bold text-cream text-xl leading-none">Annuaire des membres</span>
            <span className="font-sans text-cream/70 text-sm mt-0.5">Association Zanak'i Bongolava</span>
          </div>
        </Link>
        {onInscription ? (
          <Link
            to="/"
            className="border border-cream/40 text-cream font-sans text-sm font-semibold px-4 py-1.5 rounded-md hover:bg-cream/10 transition-colors"
          >
            ← Retour à l'annuaire
          </Link>
        ) : (
          <Link
            to="/inscription"
            className="bg-terracotta text-cream font-sans text-sm font-semibold px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity"
          >
            Rejoindre
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
