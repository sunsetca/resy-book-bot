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
  WrappedRegisterVenueForm,
  WrappedBugReportForm
} from './components/forms/FormContainer';
import Profile from './components/user/Profile';
import Home from './components/Home';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { defaultTheme } from './defaultTheme';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { auth, getResyToken } from './firebase';
import { saveFirebaseUID, saveUser, saveResyToken, setLoading } from './redux/authSlice';
import CheckResyToken from './components/user/CheckResyToken';


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
        path: "report-a-bug/",
        element: <WrappedBugReportForm/>,
        errorElement: <ErrorPage/>
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
        path: "user/:userId/check-token/",
        element: <CheckResyToken/>,
        errorElement: <ErrorPage/>
      },
      {
        path: "user/:userId/resy-res-request/",
        element: <WrappedResyResRequestForm/>,
        errorElement: <ErrorPage/>
      },
      {
        path: "user/:userId/deep-link-venue/",
        element: <WrappedRegisterVenueForm/>,
        errorElement: <ErrorPage/>
      },
    ],
  }
])

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      (async () => {
        if (user) {
          const { displayName, email, uid } = user;
          let resyToken = await getResyToken(uid);
          dispatch(saveUser({ displayName, email }));
          dispatch(saveFirebaseUID(uid));
          dispatch(saveResyToken(resyToken));
        } else {
          dispatch(saveUser(null));
          dispatch(saveFirebaseUID(null));
          dispatch(saveResyToken(null));
        }
        dispatch(setLoading(false));
      })();
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
