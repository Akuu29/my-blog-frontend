import { router } from "./components/routing/routing";
import CssBaseline from '@mui/material/CssBaseline';
import { RouterProvider } from "react-router-dom";
import { UserStatusContextProvider } from "./contexts/UserStatusContext";
import { ErrorSnackbarContextProvider } from "./contexts/ErrorSnackbarContext";
import { AuthApiContextProvider } from "./contexts/AuthApiContext";

function App() {
  return (
    <ErrorSnackbarContextProvider>
      <UserStatusContextProvider>
        <AuthApiContextProvider>
          <CssBaseline />
          <RouterProvider router={router} />
        </AuthApiContextProvider>
      </UserStatusContextProvider>
    </ErrorSnackbarContextProvider>
  );
}

export default App;
