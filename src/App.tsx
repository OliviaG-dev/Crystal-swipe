import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Swipe from './pages/Swipe/Swipe';
import Results from './pages/Results/Results';
import StoneDetail from './pages/StoneDetail/StoneDetail';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/swipe" element={<Swipe />} />
        <Route path="/results" element={<Results />} />
        <Route path="/stones/:stoneId" element={<StoneDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
