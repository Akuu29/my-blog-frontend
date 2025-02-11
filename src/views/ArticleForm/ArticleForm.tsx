import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import MDEditor from "@uiw/react-md-editor";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Close from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

import Header from "../../components/layout/Header";
import handleError from "../../utils/handle-error";
import Result from "../../utils/result";
import ArticleApi from "../../services/article-api";
import CategoryApi from "../../services/category-api";
import TagApi from "../../services/tag-api";
import { ErrorSnackbarContext } from "../../contexts/ErrorSnackbarContext";
import ArticleField from "./ArticleField";
import ArticleTitleInput from "./ArticleTitleInput";
import ArticleCategorySelector from "./ArticleCategorySelector";
import ArticleTagSelector from "./ArticleTagSelector";
import type { ErrorResponse } from "../../types/error-response";
import type { ErrorSnackbarContextProps } from "../../types/error-snackbar-context";
import type { NewArticle, ArticleStatus } from "../../types/article";
import type { Category } from "../../types/category";
import type { Tag } from "../../types/tag";

const theme = createTheme({
  typography: {
    fontFamily: "monospace",
  },
});

function ArticleForm() {
  const navigate = useNavigate();
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const [title, setTitle] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string | undefined>(undefined);
  const [existingCategories, setExistingCategories] = useState<Array<Category>>([]);
  useEffect(() => {
    (async () => {
      const result = await CategoryApi.all({});

      if (result.isOk()) {
        setExistingCategories(result.unwrap());
      } else if (result.isErr()) {
        handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
      }
    })();
  }, [navigate, openSnackbar]);
  const [existingTags, setExistingTags] = useState<Array<Tag>>([]);
  useEffect(() => {
    (async () => {
      const result = await TagApi.all();

      if (result.isOk()) {
        setExistingTags(result.unwrap());
      } else if (result.isErr()) {
        handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
      }
    })();
  }, [navigate, openSnackbar]);
  const [selectedTags, setSelectedTags] = useState<Array<string>>([]);

  const [body, setBody] = useState<string>("");

  const getCategoryId = async () => {
    if (!categoryName) {
      return Result.ok(null);
    }

    const result = await CategoryApi.all({ name: categoryName });
    if (result.isOk()) {
      const categories = result.unwrap();
      if (categories.length > 0) {
        // If the category already exists, return the id of the category.
        return Result.ok<number | null, null>(categories[0].id);
      } else {
        // If the category does not exist, create a new category and return the id of the new category.
        const result = await CategoryApi.create({ name: categoryName });
        if (result.isOk()) {
          return Result.ok<number | null, null>(result.unwrap().id);
        } else if (result.isErr()) {
          handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
          return Result.err<number | null, null>(null);
        }
      }
    }

    handleError(result.unwrap() as ErrorResponse, navigate, openSnackbar, "top", "center");
    return Result.err<number | null, null>(null);
  };

  const createArticle = async (articleStatus: ArticleStatus, category_id: number | null) => {
    const newArticle: NewArticle = {
      title,
      body,
      status: articleStatus,
      categoryId: category_id,
    };

    return await ArticleApi.create(newArticle);
  };

  const handleClose = async () => {
    const getCategoryIdResult = await getCategoryId();
    if (getCategoryIdResult.isOk()) {
      const category_id = getCategoryIdResult.unwrap();
      const createArticleResult = await createArticle("Draft", category_id);

      if (createArticleResult.isOk()) {
        const article = createArticleResult.unwrap();

        navigate(`/article/${article.id}`);
      } else if (createArticleResult.isErr()) {
        handleError(createArticleResult.unwrap(), navigate, openSnackbar, "top", "center");
      }
    }
  };

  const handleSave = async () => {
    const getCategoryIdResult = await getCategoryId();
    if (getCategoryIdResult.isOk()) {
      const category_id = getCategoryIdResult.unwrap();
      const createArticleResult = await createArticle("Published", category_id);

      if (createArticleResult.isOk()) {
        const article = createArticleResult.unwrap();

        navigate(`/article/${article.id}`);
      } else if (createArticleResult.isErr()) {
        handleError(createArticleResult.unwrap(), navigate, openSnackbar, "top", "center");
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Stack
        direction="row"
        sx={{
          padding: 2,
          justifyContent: "space-between",
          alignItems: "center"
        }}>
        <ArticleField>
          <ArticleTitleInput title={title} setTitle={setTitle} />
        </ArticleField>
        <ArticleField>
          <ArticleCategorySelector existingCategories={existingCategories} categoryName={categoryName} setCategoryName={setCategoryName} />
        </ArticleField>
        <ArticleField>
          <ArticleTagSelector existingTags={existingTags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        </ArticleField>
        <Stack direction="row" spacing={1} sx={{ justifyContent: "flx-end" }}>
          <Button
            variant="contained"
            startIcon={<Close />}
            sx={{
              fontFamily: "monospace",
            }}
            onClick={handleClose} >
            Close
          </Button>
          <Button
            variant="outlined"
            endIcon={<SaveIcon />}
            sx={{
              fontFamily: "monospace",
            }}
            onClick={handleSave}>
            Save
          </Button>
        </Stack>
      </Stack>
      <MDEditor
        value={body}
        onChange={(event) => setBody(event || "")}
        height={1200}
      />
    </ThemeProvider >
  );
}

export default ArticleForm;
