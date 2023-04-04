import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function AuthTokenHowTo() {
    return (
        <>
            <Accordion>
                <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header">
                    <Typography>Step 1: Login to Resy site</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Open <Link href="https://resy.com/">Resy</Link> in a seperate tab or window and login with your Resy <code>username</code> and <code>password</code>.
                        <br/>
                        Please note that you must have an active payment method on file with Resy to be able to complete a booking. This applies to all restaurants, even if they
                        do not charge for cancellations.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header">
                    <Typography>Step 2: Inspect element</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        While in the Resy tab right click the webpage and select <code>Inspect Element</code>. 
                    </Typography>
                    <Typography>
                        Navigate to the <code>Network</code> tab of the web console.
                    </Typography>
                    <Typography>
                        Press record and filter the network calls by searching for <code>api.resy.com</code> in the filter box of the network tab. (if this tab is empty, refresh page).
                    </Typography>
                    <Typography>
                        Click any of the rows of network calls and search for <code>x-resy-auth-token</code> in the request headers panel.
                    </Typography>
                    <Typography>
                        Copy that field and navigate back to this site.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3-content"
                    id="panel3-header">
                    <Typography>Step 3: Add token to your R.I.P Res account </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Paste the <code>x-resy-auth-token</code> in the form below and submit to register the token
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </>
    )
}

function VenueIdHowTo() {
    return (
        <>
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                <Typography>Step 1: Open Resy site</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>Open <Link href="https://resy.com/">Resy</Link> in a seperate tab or window and search for the restaurant</Typography>
            </AccordionDetails>
        </Accordion>
        <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header">
                    <Typography>Step 2: Inspect element</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        While in the Resy tab right click the webpage and select <code>Inspect Element</code>. 
                    </Typography>
                    <Typography>
                        Navigate to the <code>Network</code> tab of the web console.
                    </Typography>
                    <Typography>
                        Press record and filter the network calls by searching for <code>api.resy.com venue</code> in the filter box of the network tab. (if this tab is empty, refresh page).
                    </Typography>
                    <Typography>
                        Click on the network call with a lat and lon of 0 in the url path.
                    </Typography>
                    <Typography>
                        Copy the <code>venue_id</code> from that request url and navigate back to this site.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3-content"
                    id="panel3-header">
                    <Typography>Step 3: Add restaurant to your reservation bot request </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Paste the <code>venue_id</code> in the form below and submit to select the venue
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </>
    )
}

export {
    AuthTokenHowTo,
    VenueIdHowTo
}