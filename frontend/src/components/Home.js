import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Home = () => {
    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    marginBottom: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    }}>
                <Typography variant="body2" color="text.secondary">Currently in private mode, please login or register for access</Typography>
                <Button>
                    <Link to={`login/`}>Login</Link>
                </Button>
                <Button>
                    <Link to={`register/`}>Register</Link>
                </Button>
            </Box>
        </Container>
    );
};

export default Home;