import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import MDEditor from "@uiw/react-md-editor";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Close from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

import handleError from "../../utils/handle-error";
import Result from "../../utils/result";
import ArticleApi from "../../services/article-api";
import CategoryApi from "../../services/category-api";
import TagApi from "../../services/tag-api";
import ArticleTagsApi from "../../services/article-tags-api";
import { ErrorSnackbarContext } from "../../contexts/ErrorSnackbarContext";
import ArticleField from "./ArticleField";
import ArticleTitleInput from "./ArticleTitleInput";
import ArticleCategorySelector from "./ArticleCategorySelector";
import ArticleTagSelector from "./ArticleTagSelector";
import type { ErrorSnackbarContextProps } from "../../types/error-snackbar-context";
import type { Article, NewArticle, UpdateArticle, ArticleStatus } from "../../types/article";
import type { Category } from "../../types/category";
import type { Tag } from "../../types/tag";
import type { ArticleTag } from "../../types/article-tag";

const theme = createTheme({
  typography: {
    fontFamily: "monospace",
  },
});

function ArticleForm() {
  const navigate = useNavigate();
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const [isEditing, setIsEditing] = useState<boolean>(false);
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
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>([]);

  const [body, setBody] = useState<string>("");

  const { article_id } = useParams();
  useEffect(() => {
    if (article_id) {
      setIsEditing(true);

      const getCategoryName = async (category_id: number): Promise<Result<string, null>> => {
        const result = await CategoryApi.all({ id: category_id });

        if (result.isErr()) {
          handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
          return Result.err(null);
        }

        const categories = result.unwrap() as Array<Category>;

        if (categories.length === 0) {
          return Result.err(null);
        }

        return Result.ok(categories[0].name);
      };

      const getTags = async (article_id: number): Promise<Result<Array<Tag>, null>> => {
        const result = await TagApi.find_tags_by_article_id(article_id);

        if (result.isErr()) {
          handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
          return Result.err(null);
        }

        const articleTags = result.unwrap() as Array<Tag>;
        return Result.ok(articleTags);
      };

      (async () => {
        const findArticleResult = await ArticleApi.find(Number(article_id));

        if (findArticleResult.isErr()) {
          handleError(findArticleResult.unwrap(), navigate, openSnackbar, "top", "center");
          return;
        }

        const article = findArticleResult.unwrap() as Article;
        setTitle(article.title);
        setBody(article.body);

        if (article.categoryId) {
          const getCategoryNameResult = await getCategoryName(article.categoryId);

          if (getCategoryNameResult.isErr()) {
            return;
          }

          setCategoryName(getCategoryNameResult.unwrap() as string);
        }

        const getTagsResult = await getTags(Number(article_id));

        if (getTagsResult.isErr()) {
          return;
        }

        setSelectedTags(getTagsResult.unwrap() as Array<Tag>);
      })();
    }
  }, [article_id, navigate, openSnackbar]);

  const getCategoryId = async (): Promise<Result<number | null, null>> => {
    if (!categoryName) {
      return Result.ok(null);
    }

    const result = await CategoryApi.all({ name: categoryName });

    if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
      return Result.err(null);
    }

    const categories = result.unwrap() as Array<Category>;

    if (categories.length === 0) {
      // If the category does not exist, create a new category and return the id of the new category.
      const result = await CategoryApi.create({ name: categoryName });

      if (result.isErr()) {
        handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
        return Result.err(null);
      }

      const category = result.unwrap() as Category;
      return Result.ok(category.id);
    }

    return Result.ok(categories[0].id);
  };

  const createArticle = async (articleStatus: ArticleStatus, category_id: number | null): Promise<Result<Article, null>> => {
    const newArticle: NewArticle = {
      title,
      body,
      status: articleStatus,
      categoryId: category_id,
    };

    const result = await ArticleApi.create(newArticle);

    if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
      return Result.err(null);
    }

    const article = result.unwrap() as Article;
    return Result.ok(article);
  };

  const updateArticle = async (article_id: number, articleStatus: ArticleStatus, category_id: number | null): Promise<Result<Article, null>> => {
    const updatedArticle: UpdateArticle = {
      title,
      body,
      status: articleStatus,
      categoryId: category_id,
    };

    const result = await ArticleApi.update(article_id, updatedArticle);

    if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
      return Result.err(null);
    }

    const article = result.unwrap() as Article;
    return Result.ok(article);
  };

  const attachTags = async (article_id: number, selectedTags: Array<Tag>): Promise<Result<Array<ArticleTag>, null>> => {
    const result = await ArticleTagsApi.attachTags(article_id, selectedTags.map((tag) => tag.id));

    if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
      return Result.err(null);
    }

    const articleTags = result.unwrap() as Array<ArticleTag>;
    return Result.ok(articleTags);
  };

  const saveArticle = async (ArticleStatus: ArticleStatus, isEditing: boolean) => {
    const getCategoryIdResult = await getCategoryId();
    if (getCategoryIdResult.isErr()) {
      return;
    }

    const category_id = getCategoryIdResult.unwrap();

    let article: Article;
    if (isEditing) {
      const updateArticleResult = await updateArticle(Number(article_id), ArticleStatus, category_id);
      if (updateArticleResult.isErr()) {
        return;
      }

      article = updateArticleResult.unwrap() as Article;
    } else {
      const createArticleResult = await createArticle(ArticleStatus, category_id);
      if (createArticleResult.isErr()) {
        return;
      }

      article = createArticleResult.unwrap() as Article;
    }

    if (selectedTags.length > 0) {
      const articleTagsResult = await attachTags(article.id, selectedTags);
      if (articleTagsResult.isErr()) {
        return;
      }
    }

    return article;
  };

  const handleClose = async () => {
    const article = await saveArticle("Draft", isEditing);
    if (article) {
      navigate(`/article/${article.id}`);
    }
  };

  const handleSave = async () => {
    const article = await saveArticle("Published", isEditing);
    if (article) {
      navigate(`/article/${article.id}`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
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
