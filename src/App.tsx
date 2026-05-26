import { router } from "./components/routing/routing";
import CssBaseline from '@mui/material/CssBaseline';
import { RouterProvider } from "react-router-dom";
import { UserStatusContextProvider } from "./contexts/UserStatusContext";
import { ErrorSnackbarContextProvider } from "./contexts/ErrorSnackbarContext";
import { AuthApiContextProvider } from "./contexts/AuthApiContext";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/query-client";
import { idbPersister } from "./lib/query-persister";

const PERSIST_MAX_AGE = 24 * 60 * 60 * 1000;

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: idbPersister, maxAge: PERSIST_MAX_AGE }}
    >
      <ErrorSnackbarContextProvider>
        <UserStatusContextProvider>
          <AuthApiContextProvider>
            <CssBaseline />
            <RouterProvider router={router} />
          </AuthApiContextProvider>
        </UserStatusContextProvider>
      </ErrorSnackbarContextProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </PersistQueryClientProvider>
  );
}

export default App;
