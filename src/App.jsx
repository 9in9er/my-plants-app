import './styles/Base.scss';
import './styles/App.scss';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthScreen from './components/AuthScreen';
import PlantsPage from './components/PlantsPage';

import AuthGuard from './components/AuthGuard';
import GuestGuard from './components/GuestGuard';

import YandexMetrika from './components/YandexMetrika';


function App() {
  return (
    <BrowserRouter>
      <YandexMetrika />
      <Routes>
        <Route 
          path='/login' 
          element={ 
            <GuestGuard>
              <AuthScreen />
            </GuestGuard>
          } 
        />
        <Route 
          path='/plants' 
          element={ 
            <AuthGuard>
              <PlantsPage />
            </AuthGuard>
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
