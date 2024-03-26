import react from 'react';
import { useAuth } from './AuthContext';

const sideBar = async () => {
    const {state } = useAuth();

    if (!state.isAuthenticated) {
        return null;
    }
    
    return (
        <h1>Side bar</h1>
    )
}