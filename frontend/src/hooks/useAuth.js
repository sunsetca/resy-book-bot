import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const { user, firebaseUID } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const checkAuthAndNavigate = useCallback((path) => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(path);
    }
  }, [user, navigate]);

  return { firebaseUID, user, checkAuthAndNavigate };
}
