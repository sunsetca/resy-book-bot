import Container from "@mui/material/Container";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useLoaderData } from 'react-router-dom';
import getUserProfile from '../../backend';

export async function loader({ params }) {
    const userData = await getUserProfile({
        userId: params.userId
    });
    return userData
}

const Profile = () => {
    const { userData } = useLoaderData();
    return (
        <Container component="main" maxWidth="s">
            <Typography component="h1" variant="h5">Your Profile</Typography>
            <Button>
                <Link to={`user/${userData.userId}/register-resy-auth`}>Register Resy Auth</Link>
            </Button>
        </Container>
    );
};

export default Profile;