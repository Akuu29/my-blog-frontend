import { createBrowserRouter } from "react-router-dom";
import BasePage from "../layout/BasePage";
import ErrorPage from "../layout/ErrorPage";
import HelloWorld from "../../views/HelloWorld";
import Top from "../../views/Top";
import ArticlesByCategory from "../../views/ArticlesByCategory";
import Articles from "../../views/Articles/Articles";
import Article from "../../views/Article";
import SignIn from "../../views/SignIn";
import ArticleForm from "../../views/ArticleForm/ArticleForm";
import SearchResults from "../../views/SearchResults";

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
        element: <Top />
      },
      {
        "path": "/articles",
        element: <Articles />
      },
      {
        "path": "/article/:articleId",
        element: <Article />
      },
      {
        "path": "/category/:categoryId/articles",
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
        "path": "/editor/:articleId",
        element: <ArticleForm />
      },
      {
        "path": "/search",
        element: <SearchResults />
      },
    ]
  },
]);
