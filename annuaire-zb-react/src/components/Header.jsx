import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-muted shadow-md">
      <div className="h-full flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src="/images/logo_zb_trans.png" alt="ZB" className="h-9 sm:h-10" />
          <div className="flex flex-col leading-tight">
            <span className="font-serif font-bold text-cream text-base leading-none">Annuaire</span>
            <span className="font-sans text-cream/70 text-xl mt-0.5 hidden md:block">Association Zanak'i Bongolava</span>
          </div>
        </Link>
        <Link
          to="/inscription"
          className="bg-terracotta text-cream font-sans text-sm font-semibold px-4 py-1.5 rounded-md"
        >
          Rejoindre
        </Link>
      </div>
    </header>
  );
}

export default Header;
