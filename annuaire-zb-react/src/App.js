import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import DirectoryPage from './pages/DirectoryPage';
import InscriptionPage from './pages/InscriptionPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<DirectoryPage />} />
          <Route path="/inscription" element={<InscriptionPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
