import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const { user, firebaseUID } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const checkAuthAndNavigate = useCallback((path) => {
    if (!user) {
      navigate('/login');
    }
    navigate(path);
  }, [user, navigate]);

  const redirectToProfileIfAuth = useCallback(() => {
    if (user) {
      navigate(`/user/${firebaseUID}`);
    }
  }, [user, firebaseUID, navigate]);

  return { firebaseUID, user, checkAuthAndNavigate, redirectToProfileIfAuth };
}
