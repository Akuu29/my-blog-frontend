import { createBrowserRouter } from "react-router-dom";
import BasePage from "../layout/BasePage";
import ErrorPage from "../layout/ErrorPage";
import HelloWorld from "../../views/HelloWorld";
import Top from "../../views/Top";
import ArticlesByCategory from "../../views/ArticlesByCategory";
import Articles from "../../views/Articles/Public/Articles";
import Article from "../../views/Articles/Public/Article";
import SignIn from "../../views/SignIn";
import ArticleForm from "../../views/ArticleForm/ArticleForm";
import SearchResults from "../../views/SearchResults";
import ArticlesByUser from "../../views/Articles/User/ArticlesByUser";
import ArticleByUser from "../../views/Articles/User/ArticleByUser";
import MyArticles from "../../views/MyArticles";
import Settings from "../../views/Settings";
import { ProtectedRoute } from "./ProtectedRoute";

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
        element: <ProtectedRoute><ArticleForm /></ProtectedRoute>
      },
      {
        "path": "/editor/:articleId",
        element: <ProtectedRoute><ArticleForm /></ProtectedRoute>
      },
      {
        "path": "/search",
        element: <SearchResults />
      },
      {
        "path": "/settings",
        element: <ProtectedRoute><Settings /></ProtectedRoute>
      },
      {
        "path": "/myarticles",
        element: <ProtectedRoute><MyArticles /></ProtectedRoute>
      },
      {
        "path": "/user/:userId/articles",
        element: <ArticlesByUser />
      },
      {
        "path": "/user/:userId/article/:articleId",
        element: <ArticleByUser />
      }
    ]
  },
]);
