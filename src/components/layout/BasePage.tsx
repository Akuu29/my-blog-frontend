import { Outlet } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';

import Header from './Header';
import Footer from './Footer';
import ErrorSnackbar from "./ErrorSnackbar";

function BasePage() {
  return (
    <>
      <CssBaseline />
      <ErrorSnackbar />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default BasePage;
