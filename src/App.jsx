import './styles/Base.scss';
import './styles/App.scss';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthScreen from './components/AuthScreen';
import PlantsPage from './components/PlantsPage';

import YandexMetrika from './components/YandexMetrika';


function App() {
  return (
    <BrowserRouter>
      <YandexMetrika />
      <Routes>
        <Route path='/login' element={ <AuthScreen /> } />
        <Route path='/plants' element={ <PlantsPage /> } />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
