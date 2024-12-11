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

import AuthApi from '../services/auth-api';
import TokenApi from '../services/token-api';
import { UserStatusContext } from '../contexts/UserStatusContext';
import type { UserStatusContextProps } from "../types/user-status-context";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

function SignIn() {
  const navigate = useNavigate();
  const { updateIsLoggedIn } = useContext(UserStatusContext) as UserStatusContextProps;
  // const [cookie, setCookie] = useCookies();

  const sendTokenToServiceWorker = (token: string) => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SET_ACCESS_TOKEN",
        message: token,
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (data.get("email") && data.get("password")) {
      const result = await AuthApi.signIn(data.get("email") as string, data.get("password") as string);

      if (result.isOk()) {
        sendTokenToServiceWorker(result.value.idToken);
        const verifyResult = await TokenApi.verifyIdToken();

        if (verifyResult.isOk()) {
          // TODO Handle refresh token
          const { accessToken, refreshToken } = verifyResult.value;

          sendTokenToServiceWorker(accessToken);
          // setCookie("refresh_token", refreshToken, {
          //   path: "/",
          //   expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          //   // sameSite: "strict",
          //   // secure: true,
          //   httpOnly: true,
          // });

          updateIsLoggedIn(true);
          navigate("/");
        }

      } else {
        // TODO error handling
        console.error(result);
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
