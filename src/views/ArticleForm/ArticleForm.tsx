import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import MDEditor, { commands } from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";

import handleError from "../../utils/handle-error";
import Result from "../../utils/result";
import ArticleApi from "../../services/article-api";
import CategoryApi from "../../services/category-api";
import TagApi from "../../services/tag-api";
import ImageApi from "../../services/image-api";
import { ErrorSnackbarContext } from "../../contexts/ErrorSnackbarContext";
import ArticleField from "./ArticleField";
import ArticleTitleInput from "./ArticleTitleInput";
import ArticleCategorySelector from "./ArticleCategorySelector";
import ArticleTagSelector from "./ArticleTagSelector";
import ArticleImageUploader from "./ArticleImageUploader";
import type { ErrorSnackbarContextProps } from "../../types/error-snackbar-context";
import type { Article, NewArticle, UpdateArticle, ArticleStatus } from "../../types/article";
import type { Category } from "../../types/category";
import type { Tag } from "../../types/tag";
import type { Image } from "../../types/image";

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
  const articleCreatedRef = useRef<boolean>(false);
  useEffect(() => {
    (async () => {
      const result = await CategoryApi.all({});

      if (result.isOk()) {
        setExistingCategories(result.unwrap());
      } else if (result.isErr()) {
        handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
      }
    })();
  }, [navigate]);
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
  }, [navigate]);
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>([]);
  const [uploadedImages, setUploadedImages] = useState<Array<Image>>([]);
  const [body, setBody] = useState<string>("");

  const { articleId } = useParams();
  useEffect(() => {
    if (!articleId && !articleCreatedRef.current) {
      // create an empty article to link image to the article
      articleCreatedRef.current = true;
      (async () => {
        const newArticle: NewArticle = {
          status: "Draft",
        };
        const result = await ArticleApi.create(newArticle);
        if (result.isErr()) {
          handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
          return;
        }

        const article = result.unwrap() as Article;
        navigate(`/editor/${article.id}`);
      })();
    } else if (articleId) {
      const getCategoryName = async (categoryId: string): Promise<Result<string, null>> => {
        const result = await CategoryApi.all({ id: categoryId });

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

      const getTags = async (articleId: string): Promise<Result<Array<Tag>, null>> => {
        const result = await TagApi.findTagsByArticleId(articleId);

        if (result.isErr()) {
          handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
          return Result.err(null);
        }

        const articleTags = result.unwrap() as Array<Tag>;
        return Result.ok(articleTags);
      };

      const getImages = async (articleId: string): Promise<Result<Array<Image>, null>> => {
        const result = await ImageApi.all(articleId);

        if (result.isErr()) {
          handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
          return Result.err(null);
        }

        return Result.ok(result.unwrap() as Array<Image>);
      };

      (async () => {
        const findArticleResult = await ArticleApi.find(articleId);

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

        const getTagsResult = await getTags(articleId);

        if (getTagsResult.isErr()) {
          return;
        }

        setSelectedTags(getTagsResult.unwrap() as Array<Tag>);

        const getImagesResult = await getImages(articleId);

        if (getImagesResult.isErr()) {
          return;
        }

        setUploadedImages(getImagesResult.unwrap() as Array<Image>);
      })();
    }
  }, [articleId, navigate]);

  const getCategoryId = async (): Promise<Result<string | null, null>> => {
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

  const updateArticle = async (articleId: string, articleStatus: ArticleStatus, categoryId: string | null): Promise<Result<Article, null>> => {
    const updatedArticle: UpdateArticle = {
      title,
      body,
      status: articleStatus,
      categoryId: categoryId,
    };

    const result = await ArticleApi.update(articleId, updatedArticle);

    if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
      return Result.err(null);
    }

    const article = result.unwrap() as Article;
    return Result.ok(article);
  };

  const attachTags = async (articleId: string, selectedTags: Array<Tag>): Promise<Result<null, null>> => {
    const result = await ArticleApi.attachTags(articleId, selectedTags.map((tag) => tag.id));

    if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
      return Result.err(null);
    }

    return Result.ok(null);
  };

  const saveArticle = async (articleId: string, ArticleStatus: ArticleStatus) => {
    const getCategoryIdResult = await getCategoryId();
    if (getCategoryIdResult.isErr()) {
      return;
    }
    const categoryId = getCategoryIdResult.unwrap();

    const updateArticleResult = await updateArticle(articleId, ArticleStatus, categoryId);
    if (updateArticleResult.isErr()) {
      return;
    }
    const article = updateArticleResult.unwrap() as Article;

    if (selectedTags.length > 0) {
      const articleTagsResult = await attachTags(article.id, selectedTags);
      if (articleTagsResult.isErr()) {
        return;
      }
    }

    return article;
  };

  const handleSave = async () => {
    if (!articleId) {
      return;
    }

    const article = await saveArticle(articleId, "Published");
    if (article) {
      navigate(`/article/${article.id}`);
    }
  };

  const handleImageUpload = (filename: string, imageUrl: string) => {
    const imageMarkdown = `\n![${filename}](${imageUrl})\n`;
    setBody((prevBody) => {
      if (!prevBody) {
        return imageMarkdown;
      }

      return prevBody + imageMarkdown;
    });
  };

  const handleDeleteImage = (filename: string, imageUrl: string) => {
    const imageMarkdown = `\n![${filename}](${imageUrl})\n`;
    setBody((prevBody) => prevBody.replace(imageMarkdown, ""));
  };

  return (
    <ThemeProvider theme={theme}>
      <Stack
        direction="row"
        sx={{
          padding: 2,
          justifyContent: "space-between",
          alignItems: "flex-start"
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
        <ArticleField>
          <ArticleImageUploader articleId={articleId} uploadedImages={uploadedImages} setUploadedImages={setUploadedImages} onImageUpload={handleImageUpload} onDeleteImage={handleDeleteImage} />
        </ArticleField>
        <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
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
        commands={[commands.help]}
        height={1200}
        previewOptions={{
          rehypePlugins: [rehypeSanitize],
        }}
      />
    </ThemeProvider>
  );
}

export default ArticleForm;
