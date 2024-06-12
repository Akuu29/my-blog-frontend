import { createBrowserRouter } from "react-router-dom";
import Default from "../layout/Default";
import ErrorPage from "../layout/ErrorPage";
import Articles from "../../views/Articles";
import Article from "../../views/Article";
import HelloWorld from "../../views/HelloWorld";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Default />,
    errorElement: <ErrorPage />,
    children: [
      {
        "path": "/helloworld",
        element: <HelloWorld />,
      },
      {
        "path": "/",
        element: <Articles />
      },
      {
        "path": "/article/:id",
        element: <Article />
      }
    ]
  }
]);