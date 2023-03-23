import Container from "@mui/material/Container";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useLoaderData } from 'react-router-dom';
import getUserProfile from '../../backend';

export async function loader({ params }) {
    const userData = await getUserProfile({
        userId: params.userId
    });
    return userData;
}

const Profile = () => {
    const userData  = useLoaderData();
    let resyAction;

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

export default Profile;