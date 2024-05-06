import { router } from "./components/routing/routing";
import { RouterProvider } from "react-router-dom";

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
