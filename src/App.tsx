import { router } from "./components/routing/routing";
import { RouterProvider } from "react-router-dom";
import { UserStatusContextProvider } from "./contexts/UserStatusContext";
import { ErrorSnackbarContextProvider } from "./contexts/ErrorSnackbarContext";

function App() {
  return (
    <ErrorSnackbarContextProvider>
      <UserStatusContextProvider>
        <RouterProvider router={router} />
      </UserStatusContextProvider>
    </ErrorSnackbarContextProvider>
  );
}

export default App;
