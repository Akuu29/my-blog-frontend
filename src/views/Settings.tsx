import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMore from "@mui/icons-material/ExpandMore";

import FirebaseAuthApi from "../services/firebase-auth-api";
import UserApi from "../services/user-api";
import handleError from "../utils/handle-error";
import { ErrorSnackbarContext } from "../contexts/ErrorSnackbarContext";
import { UserStatusContext } from "../contexts/UserStatusContext";
import type { ErrorSnackbarContextProps } from "../types/error-snackbar-context";
import type { UserStatusContextProps } from "../types/user-status-context";
import { AuthApiContext } from "../contexts/AuthApiContext";

const theme = createTheme({
  typography: {
    fontFamily: "string",
  }
});

type SettingMenu = "user-settings";

function Settings() {
  const navigate = useNavigate();
  const userStatus = useContext(UserStatusContext) as UserStatusContextProps;
  const firebaseAuthApi = useContext(AuthApiContext) as FirebaseAuthApi;
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const openSnackbarRef = useRef(openSnackbar);
  useEffect(() => { openSnackbarRef.current = openSnackbar; }, [openSnackbar]);

  const [selectedMenu, setSelectedMenu] = useState<SettingMenu>("user-settings");
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isPasswordLoading, setIsPasswordLoading] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [showReauthDialog, setShowReauthDialog] = useState<boolean>(false);
  const [expandedUsername, setExpandedUsername] = useState<boolean>(false);
  const [expandedPassword, setExpandedPassword] = useState<boolean>(false);

  // Initialize with current user name
  useEffect(() => {
    if (userStatus.currentUserName) {
      setUserName(userStatus.currentUserName);
    }
  }, [userStatus.currentUserName]);

  const handleMenuClick = (menu: SettingMenu) => {
    setSelectedMenu(menu);
  };

  const handleChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userStatus.currentUserId) return;
    if (!userName.trim()) {
      openSnackbarRef.current("top", "center", "User name cannot be empty",);
      return;
    }

    setIsLoading(true);

    try {
      const result = await UserApi.update(userStatus.currentUserId, { name: userName.trim() });

      if (result.isOk()) {
        const updatedUser = result.unwrap();
        userStatus.updateCurrentUserName(updatedUser.name);
      } else if (result.isErr()) {
        handleError(result.unwrap(), navigate, openSnackbarRef.current, "top", "center");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeNewPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const handleChangeConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleReauthDialogClose = () => {
    // Reset user status and navigate to sign in page
    userStatus.updateIsLoggedIn(false);
    userStatus.updateCurrentUserId(null);
    userStatus.updateCurrentUserName(null);
    navigate("/signin");
  };

  const handleUsernameAccordionChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedUsername(isExpanded);
  };

  const handlePasswordAccordionChange = (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPassword(isExpanded);
  };

  const handlePasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newPassword.trim()) {
      openSnackbarRef.current("top", "center", "Password cannot be empty");
      return;
    }

    if (newPassword !== confirmPassword) {
      openSnackbarRef.current("top", "center", "Passwords do not match");
      return;
    }

    setIsPasswordLoading(true);

    try {
      const result = await firebaseAuthApi.updatePassword(newPassword);

      if (result.isOk()) {
        // Reset form
        setNewPassword("");
        setConfirmPassword("");

        // Reset user status and redirect to sign in page
        userStatus.updateIsLoggedIn(false);
        userStatus.updateCurrentUserId(null);
        userStatus.updateCurrentUserName(null);

        openSnackbarRef.current("top", "center", "Password updated successfully. Please sign in again.");
        // navigate("/signin");
      } else if (result.isErr()) {
        const error = result.unwrap();

        // Check if error message contains CREDENTIAL_TOO_OLD_LOGIN_AGAIN
        if (typeof error === "object" && error.message === "CREDENTIAL_TOO_OLD_LOGIN_AGAIN") {
          setShowReauthDialog(true);
        } else {
          openSnackbarRef.current("top", "center", "Failed to update password");
        }
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // Nothing is displayed before authentication
  if (userStatus.isInitializing || !userStatus.isLoggedIn || !userStatus.currentUserId) {
    return null;
  }

  const renderContent = () => {
    switch (selectedMenu) {
      case "user-settings":
        return (
          <Card>
            <Typography variant="h4" sx={{ p: 2 }}>
              User Settings
            </Typography>
            {/*Change Username*/}
            <Accordion expanded={expandedUsername} onChange={handleUsernameAccordionChange}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="username-content"
                id="username-header"
              >
                <Typography variant="h6">Change Username</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="User Name"
                    value={userName}
                    onChange={handleChangeUserName}
                    fullWidth
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{ alignSelf: "flex-end" }}
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
            {/*Change Password*/}
            <Accordion expanded={expandedPassword} onChange={handlePasswordAccordionChange}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="password-content"
                id="password-header"
              >
                <Typography variant="h6">Change Password</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box component="form" onSubmit={handlePasswordChange} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="New Password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={handleChangeNewPassword}
                    fullWidth
                    disabled={isPasswordLoading}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowNewPassword}
                            edge="end"
                          >
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleChangeConfirmPassword}
                    fullWidth
                    disabled={isPasswordLoading}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isPasswordLoading}
                    sx={{ alignSelf: "flex-end" }}
                  >
                    {isPasswordLoading ? "Saving..." : "Save"}
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>

          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Typography variant="h4" sx={{ fontFamily: "monospace", mb: 3 }}>
          Settings
        </Typography>

        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Left Sidebar Menu */}
          <Box sx={{ width: 250, flexShrink: 0 }}>
            <Card>
              <List component="nav">
                <ListItemButton
                  selected={selectedMenu === "user-settings"}
                  onClick={() => handleMenuClick("user-settings")}
                >
                  <ListItemText primary="User Settings" />
                </ListItemButton>
                <Divider />
              </List>
            </Card>
          </Box>

          {/* Right Content Area */}
          <Box sx={{ flexGrow: 1 }}>
            {renderContent()}
          </Box>
        </Box>
      </Box>

      {/* Re-authentication Dialog */}
      <Dialog
        open={showReauthDialog}
        onClose={(_event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            handleReauthDialogClose();
          }
        }}
      >
        <DialogTitle>Re-authentication Required</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your credentials are too old. Please sign in again to update your password.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReauthDialogClose} variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default Settings;
