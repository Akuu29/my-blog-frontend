import { Grid } from "@mui/material";
import AppBar from "@mui/material/AppBar";

function Footer(): JSX.Element {
  return (
    <AppBar position="static" component="footer" sx={{ top: "auto", bottom: 0 }} >
      <Grid container justifyContent="center">
        <p>&copy; 2021 My Blog. All rights reserved.</p>
      </Grid>
    </AppBar>
  );
}

export default Footer;
