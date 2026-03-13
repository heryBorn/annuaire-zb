import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-soil shadow-md">
      <div className="h-full flex items-center justify-between px-6">
        <Link to="/">
          <img src="/images/logo_zb_trans.png" alt="ZB" className="h-7 sm:h-8" />
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
