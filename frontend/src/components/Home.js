import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div id="nested-home">
            <Typography variant="body2" color="text.secondary" align="center">Currently in private mode, please register or sign in to access</Typography>
            <Button align="center">
                <Link to={`login/`}>Login</Link>
            </Button>
            <Button align="center">
                <Link to={`register/`}>Register</Link>
            </Button>
        </div>
    );
};

export default Home;