import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { match } from 'ts-pattern';

import TokenApi from '../../services/token-api';
import handleError from '../../utils/handle-error';
import { UserStatusContext } from '../../contexts/UserStatusContext';
import { ErrorSnackbarContext } from '../../contexts/ErrorSnackbarContext';
import type { UserStatusContextProps } from "../../types/user-status-context";
import type { ErrorSnackbarContextProps } from '../../types/error-snackbar-context';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

type MenuItem = 'Profile' | 'Account' | 'Dashboard' | 'Logout';

function Header() {
  const { isLoggedIn, updateIsLoggedIn } = useContext(UserStatusContext) as UserStatusContextProps;
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleTitleClick = () => {
    navigate('/');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  const logout = async () => {
    const result = await TokenApi.resetRefreshToken();
    if (result.isOk()) {
      navigator.serviceWorker.controller?.postMessage({
        type: "RESET_ACCESS_TOKEN",
      });

      updateIsLoggedIn(false);
    } else if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
    }
  };

  const onClickMenuItem = (item: MenuItem) => {
    match(item)
      .with('Profile', () => {
        // TODO: Implement profile page
        alert('Profile');
      })
      .with('Account', () => {
        // TODO: Implement account page
        alert('Account');
      })
      .with('Dashboard', () => {
        // TODO: Dashboard page
        alert('Dashboard');
      })
      .with('Logout', () => {
        logout();
      })
      .exhaustive();

    handleCloseUserMenu();
  };

  return (
    <AppBar position="static">
      <Toolbar disableGutters>
        <Grid container alignItems="center">
          <Grid item xs />
          <Grid item>
            <Link
              color="inherit"
              underline="none"
              onClick={handleTitleClick}
              sx={{
                cursor: 'pointer',
              }}
            >
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  flexGrow: 1,
                  textAlign: 'center',
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  textDecoration: 'none',
                }}
              >
                Space Shelf
              </Typography>
            </Link>
          </Grid>
          <Grid item xs>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {isLoggedIn ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 1 }}>
                      <Avatar alt="Unknown" src="/static/images/avatar/2.jpg" />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting) => (
                      <MenuItem key={setting} onClick={() => onClickMenuItem(setting as MenuItem)}>
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : (
                <Button color="inherit" onClick={handleSignIn}>
                  <Typography sx={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.1rem',
                    p: 1,
                  }}>
                    Sign In
                  </Typography>
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar >
  );
}

export default Header;
