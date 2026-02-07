import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Container from '@mui/material/Container';
import { match } from 'ts-pattern';

import TokenApi from '../../services/token-api';
import handleError from '../../utils/handle-error';
import { UserStatusContext } from '../../contexts/UserStatusContext';
import { ErrorSnackbarContext } from '../../contexts/ErrorSnackbarContext';
import type { UserStatusContextProps } from "../../types/user-status-context";
import type { ErrorSnackbarContextProps } from '../../types/error-snackbar-context';

const settings = ['Settings', 'MyArticles', 'Logout'];

type MenuItem = 'Settings' | 'MyArticles' | 'Logout';

function Header() {
  const { isLoggedIn, currentUserName, updateIsLoggedIn } = useContext(UserStatusContext) as UserStatusContextProps;
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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
      .with('Settings', () => {
        navigate('/settings');
      })
      .with('MyArticles', () => {
        navigate('/myarticles');
      })
      .with('Logout', () => {
        logout();
      })
      .exhaustive();

    handleCloseUserMenu();
  };

  return (
    <AppBar position="static" sx={{ minHeight: 100, position: 'relative' }}>
      {/* Signin Button - Positioned at absolute right */}
      <Box sx={{ position: 'absolute', top: 8, right: 16, zIndex: 1 }}>
        {isLoggedIn ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 1 }}>
                <Avatar alt={currentUserName || "User"}>
                  {currentUserName?.charAt(0).toUpperCase() || "U"}
                </Avatar>
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
              px: 1,
            }}>
              Sign In
            </Typography>
          </Button>
        )}
      </Box>

      <Container maxWidth="lg" sx={{ height: '100%' }}>
        {/* Center Section: Logo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3, pb: 2 }}>
          <Link
            color="inherit"
            underline="none"
            onClick={handleTitleClick}
            sx={{
              cursor: 'pointer',
            }}
          >
            <Typography
              variant="h4"
              noWrap
              component="div"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 300,
                letterSpacing: '.3rem',
                textDecoration: 'none',
              }}
            >
              SpaceShelf
            </Typography>
          </Link>
        </Box>

        {/* Lower Section: Search Box directly under SpaceShelf */}
        <Box sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              maxWidth: 500,
              width: '100%',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            <TextField
              size="small"
              placeholder="Search articles and users..."
              value={searchQuery}
              onChange={handleSearchChange}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  height: '36px',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.8)',
                  opacity: 1,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                      sx={{ color: 'white', p: 0.5 }}
                      size="small"
                    >
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      </Container>
    </AppBar >
  );
}

export default Header;
