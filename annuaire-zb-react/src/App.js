import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
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
      <Footer />
    </BrowserRouter>
  );
}

export default App;
