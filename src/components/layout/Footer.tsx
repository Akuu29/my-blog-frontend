import { Grid } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link';

function Footer() {
  return (
    <AppBar position="static" component="footer" color="default" sx={{ position: 'fixed', bottom: 0 }} >
      <Grid container justifyContent="center">
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © '}
          <Link color="inherit" href="/">
            Your Website
          </Link>{' '}
          {'2024.'}
        </Typography>
      </Grid>
    </AppBar>
  );
}

export default Footer;