import { createBrowserRouter } from "react-router-dom";
import BasePage from "../layout/BasePage";
import ErrorPage from "../layout/ErrorPage";
import ArticlesByCategory from "../../views/ArticlesByCategory";
import Articles from "../../views/Articles/Articles";
import Article from "../../views/Article";
import SignIn from "../../views/SignIn";
import ArticleForm from "../../views/ArticleForm/ArticleForm";
import HelloWorld from "../../views/HelloWorld";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <BasePage />,
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
        "path": "/article/:article_id",
        element: <Article />
      },
      {
        "path": "/category/:category_name",
        element: <ArticlesByCategory />
      },
      {
        "path": "/signin",
        element: <SignIn />
      },
      {
        "path": "/editor",
        element: <ArticleForm />
      },
      {
        "path": "/editor/:article_id",
        element: <ArticleForm />
      }
    ]
  },
]);
