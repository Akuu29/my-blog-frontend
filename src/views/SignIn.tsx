import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import FirebaseAuthApi from '../services/firebase-auth-api';
import UserApi from '../services/user-api';
import { UserStatusContext } from '../contexts/UserStatusContext';
import handleError from "../utils/handle-error";
import { ErrorSnackbarContext } from "../contexts/ErrorSnackbarContext";
import type { UserStatusContextProps } from "../types/user-status-context";
import type { ErrorSnackbarContextProps } from "../types/error-snackbar-context";
import { AuthApiContext } from '../contexts/AuthApiContext';

const defaultTheme = createTheme();

function SignIn() {
  const navigate = useNavigate();
  const { updateIsLoggedIn } = useContext(UserStatusContext) as UserStatusContextProps;
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const firebaseAuthApi = useContext(AuthApiContext) as FirebaseAuthApi;

  const sendTokenToServiceWorker = (token: string) => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SET_ACCESS_TOKEN",
        message: token,
      });
    } else {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: "SET_ACCESS_TOKEN",
          message: token,
        });
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (data.get("email") && data.get("password")) {
      const result = await firebaseAuthApi.signIn(
        data.get("email") as string,
        data.get("password") as string
      );

      if (result.isOk()) {
        const verifyResult = await UserApi.signIn(result.value);

        if (verifyResult.isOk()) {
          const { accessToken } = verifyResult.value;

          sendTokenToServiceWorker(accessToken);

          updateIsLoggedIn(true);
          navigate("/articles");
        }

      } else if (result.isErr()) {
        handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;
