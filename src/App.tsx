import { router } from "./components/routing/routing";
import { RouterProvider } from "react-router-dom";
import { UserStatusContextProvider } from "./contexts/UserStatusContext";

function App() {
  return (
    <UserStatusContextProvider>
      <RouterProvider router={router} />
    </UserStatusContextProvider>
  );
}

export default App;
