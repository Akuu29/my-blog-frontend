import { Outlet } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import { Grid } from '@mui/material';
import "modern-css-reset";

function Default() {
  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={2.5}>
          <LeftSideBar />
        </Grid>
        <Grid item xs={7}>
          <Outlet />
        </Grid>
        <Grid item xs={2.5}>
          <RightSideBar />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default Default;
