import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { checkUserResyToken} from '../../backend.js';
import { ProtectedRoute } from '../ProtectedRoute';

async function loader({ params }) {
    const tokenData = await checkUserResyToken({
        userId: params.userId
    });
    return tokenData;
}

function CheckResyToken(){
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [validToken, setValidToken] = useState(false);
    const [fetched, setFetched] = useState(false);
    const {user, firebaseUID} = useAuth();
    let redirectAction;

    useEffect(() => {
        if (user && !fetched) {
            (async () => {
                const fetchedTokenData = await loader({ params: { userId: firebaseUID } });
                if (fetchedTokenData.status === 200) {
                    setMessage(`Your Resy token is valid. Please proceed to your`);
                    setValidToken(true);
                } else {
                    setMessage(`Your Resy token is invalid. Please register a new token`);
                    setValidToken(false);
                }
                setLoading(false);
                setFetched(true);
            })();
        }
    }, [user, firebaseUID, fetched]);
    
    if (loading) {
        return <div>Loading...</div>;
    }
    if (validToken) {
        redirectAction = <Link to={`/user/${firebaseUID}`}> profile</Link>
    } else {
        redirectAction = <Link to={`resy-auth`}> here</Link>
    }
    return (
        <Container component="main" maxWidth="s">
            <Box
                sx={{
                marginTop: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}>
                    <Avatar sx={{m: 1}}>
                <KeyOutlinedIcon />
            </Avatar>
                <Typography component="h1" variant="h5">Resy Auth Token Status</Typography>
                <Typography component="h4" variant="h6">{message} {redirectAction}</Typography>
            </Box>
        </Container>)
}

CheckResyToken.loader = loader;
export default ProtectedRoute(CheckResyToken);