
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
  WrappedResyResRequestForm } from './components/forms/FormContainer';
import Profile, { loader as profileLoader } from './components/user/Profile';
import Home from './components/Home';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { defaultTheme } from './defaultTheme';

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
        path: "register/",
        element: <WrappedRegistrationForm/>
      },
      {
        path: "user/:userId/",
        element: <Profile/>,
        errorElement: <ErrorPage/>,
        loader: profileLoader
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
      }
    ],
  }
])

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router}/>
    </ThemeProvider>
  );
};

export default App;
