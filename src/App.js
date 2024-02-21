import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import RelatorioPdf from './pages/home/relatorio/RelatorioPdf';

function App() {
  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/relatorio-pdf" element={<RelatorioPdf />} />
    </Routes>
  );
}

export default App;
