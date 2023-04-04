import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { Link } from 'react-router-dom';
import {getUserProfile} from '../../backend';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Avatar, Box, Button, Container, Divider, Typography, Table, TableContainer, TableHead, TableCell, TableRow, TableBody } from "@mui/material";
import { Paper } from "@mui/material";

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
    let resyAction;

    useEffect(() => {
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
        resyAction = <Button xs={{marginTop: 2, marginBottom: 2}}><Link to={`resy-res-request`}>Create Reservation Task Request</Link></Button>;
    } else {
        resyAction = <Button><Link to={`resy-auth`}>Register Resy Auth</Link></Button>;
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
                <AccountBoxIcon />
            </Avatar>
            <Typography component="h1" variant="h5">Your Profile</Typography>
            <Divider flexItem={true} sx={{marginTop: 2, marginBottom: 2}}/>
            <Typography component="h3" variant="h5" >Current reservation bot requests</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Task ID</TableCell>
                            <TableCell align="right">Venue</TableCell>
                            <TableCell align="right">Reservation Date</TableCell>
                            <TableCell align="right">Reservation Time</TableCell>
                            <TableCell align="right">Party Size</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { userData.tasks ? 
                            userData.tasks.map((row) => (
                                <TableRow
                                    key={row.task_id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">{row.task_id}</TableCell>
                                    <TableCell align="right">{row.venue_id}</TableCell>
                                    <TableCell align="right">{row.res_day}</TableCell>
                                    <TableCell align="right">{row.res_times}</TableCell>
                                    <TableCell align="right">{row.party_size}</TableCell>
                                </TableRow>
                            )) : <></>
                            }
                    </TableBody>
                </Table>
            </TableContainer>
                {resyAction}
          </Box>
            
        </Container>
    );
};
Profile.loader = loader;

export default Profile;