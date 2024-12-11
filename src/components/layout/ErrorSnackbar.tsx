import * as React from 'react';
import { useContext } from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { ErrorSnackbarContext } from '../../contexts/ErrorSnackbarContext';
import type { ErrorSnackbarContextProps } from '../../types/error-snackbar-context';

function ErrorSnackbar() {
  const { snackbarState, closeSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const { open, vertical, horizontal, message } = snackbarState;

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    closeSnackbar();
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: vertical,
          horizontal: horizontal,
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={action}
      />
    </div>
  );
}

export default ErrorSnackbar;
