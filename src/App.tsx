import { router } from "./components/routing/routing";
import CssBaseline from '@mui/material/CssBaseline';
import { RouterProvider } from "react-router-dom";
import { UserStatusContextProvider } from "./contexts/UserStatusContext";
import { ErrorSnackbarContextProvider } from "./contexts/ErrorSnackbarContext";

function App() {
  return (
    <ErrorSnackbarContextProvider>
      <UserStatusContextProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </UserStatusContextProvider>
    </ErrorSnackbarContextProvider>
  );
}

export default App;
