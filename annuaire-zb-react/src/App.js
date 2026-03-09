import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import DirectoryPage from './pages/DirectoryPage';
import InscriptionPage from './pages/InscriptionPage';

function App() {
  return (
    <BrowserRouter>
      {/* Verification banner — remove after Phase 1 checkpoint */}
      <div className="bg-soil text-cream text-xs px-3 py-1 flex items-center gap-2">
        <FontAwesomeIcon icon={faLeaf} />
        <span>FA + Tailwind OK</span>
        <span className="ml-auto opacity-60">{process.env.REACT_APP_SHEET_API_URL ? 'ENV OK' : 'ENV MISSING'}</span>
      </div>
      <Routes>
        <Route path="/" element={<DirectoryPage />} />
        <Route path="/inscription" element={<InscriptionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
