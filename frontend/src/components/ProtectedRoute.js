import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export function ProtectedRoute(Component) {
  return function ProtectedComponent(props) {
    const { user, loading } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && !user) {
        navigate('/login', { replace: true, state: { from: props.location } });
      }
    }, [user, navigate, props.location, loading]);

    return !loading && user ? <Component {...props} /> : null;
  };
}
