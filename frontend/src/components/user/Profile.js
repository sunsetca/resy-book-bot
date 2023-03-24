import Container from "@mui/material/Container";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useLoaderData } from 'react-router-dom';
import {getUserProfile} from '../../backend';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

async function loader({ params }) {
    const userData = await getUserProfile({
        userId: params.userId
    });
    return userData;
}

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [fetched, setFetched] = useState(false);
    const {user, firebaseUID} = useSelector((state) => state.auth);
    const navigate = useNavigate();
    let resyAction;

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    });

    useEffect(() => {
        console.log("Profile useEffect is called");
        if (user && !fetched) {
            (async () => {
                const fetchedUserData = await loader({ params: { userId: firebaseUID } });
                setUserData(fetchedUserData);
                setLoading(false);
                setFetched(true);
            })();
        }
    }, [user, firebaseUID, fetched]);
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (userData && userData.activeToken){
        resyAction = <Button><Link to={`resy-res-request`}>Create Reservation Task Request</Link></Button>;
    } else {
        resyAction = <Button><Link to={`resy-auth`}>Register Resy Auth</Link></Button>;
    }

    return (
        <Container component="main" maxWidth="s">
            <Typography component="h1" variant="h5">Your Profile</Typography>
            {resyAction}
        </Container>
    );
};
Profile.loader = loader;

export default Profile;