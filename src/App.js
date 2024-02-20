import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import HomePdf from './pages/HomePdf';

function App() {
  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/home-pdf" element={<HomePdf />} />
    </Routes>
  );
}

export default App;
