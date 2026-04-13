import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

import leafPreloader from '../i/leaf.svg';

function GuestGuard({ children }) {
    const { user, authLoading } = useAuth();

    if (authLoading) {
        return (
        <div className='preloader'>
            <div className="preloaderWrap">
            <img src={leafPreloader} className='leaf' alt='загрузка...' />
            </div>
        </div>
        );
    }

    if (user) {
        return <Navigate to='/plants' replace />
    }

    return children;
}

export default GuestGuard;