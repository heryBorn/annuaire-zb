import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-soil text-cream font-sans text-sm text-center py-4 px-6 mt-8">
      © 2026 Association Zanak'i Bongolava · Annuaire des membres ·{' '}
      <Link to="/inscription" className="text-wheat hover:underline">
        Rejoindre l'annuaire
      </Link>
    </footer>
  );
}

export default Footer;
