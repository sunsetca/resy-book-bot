
import ErrorPage from './components/ErrorPage';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import Root from './routes/root';
import { 
  WrappedRegistrationForm, 
  WrappedSignInForm, 
  WrappedResyTokenForm, 
  WrappedResyResRequestForm,
  WrappedPasswordResetForm, 
  WrappedVenueSearchForm} from './components/forms/FormContainer';
import Profile from './components/user/Profile';
import Home from './components/Home';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { defaultTheme } from './defaultTheme';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { auth } from './firebase';
import { saveFirebaseUID, saveUser } from './redux/authSlice';


const theme = createTheme(defaultTheme);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "",
        element: <Home/>
      },
      {
        path: "login/",
        element: <WrappedSignInForm/>
      },
      {
        path: "password-reset/",
        element: <WrappedPasswordResetForm/>
      },
      {
        path: "register/",
        element: <WrappedRegistrationForm/>
      },
      {
        path: "user/:userId/",
        element: <Profile/>,
        errorElement: <ErrorPage/>,
        loader: Profile.loader
      },
      {
        path: "user/:userId/resy-auth/",
        element: <WrappedResyTokenForm/>,
        errorElement: <ErrorPage/>
      },
      {
        path: "user/:userId/resy-res-request/",
        element: <WrappedResyResRequestForm/>,
        errorElement: <ErrorPage/>
      },
      {
        path: "user/venue-search",
        element: <WrappedVenueSearchForm/>
      },
    ],
  }
])

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const {displayName, email, uid} = user;
        dispatch(saveUser({displayName, email}));
        dispatch(saveFirebaseUID(uid));
      } else {
        dispatch(saveUser(null));
        dispatch(saveFirebaseUID(null));
      }
    });
    return unsubscribe;
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
        <RouterProvider router={router}/>
    </ThemeProvider>
  );
};

export default App;
