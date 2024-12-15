import { ChangeEventHandler, useState, useContext, MouseEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import MDEditor from "@uiw/react-md-editor";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Close from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import IconButton from "@mui/material/IconButton";

import ArticleApi from "../services/article-api";
import CategoryApi from "../services/category-api";
import handleError from "../utils/handle-error";
import Result from "../utils/result";
import { ErrorSnackbarContext } from "../contexts/ErrorSnackbarContext";
import type { NewArticle, ArticleStatus } from "../types/article";
import type { Category } from "../types/category";
import type { ErrorResponse } from "../types/error-response";
import type { ErrorSnackbarContextProps } from "../types/error-snackbar-context";


function Editor() {
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
  const [body, setBody] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openCategoryMenu = Boolean(anchorEl);

  const handleClickDropIcon = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickCategoryItem = (event: MouseEvent<HTMLElement>) => {
    setCategoryName(event.currentTarget.textContent || undefined);
    setAnchorEl(null);
  };

  const handleChangeCategory: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    setCategoryName(event.target.value);
  };

  const handleChangeTitle: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    setTitle(event.target.value);
  };

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
    <>
      <Header />
      <Stack
        direction="row"
        spacing={2}
        sx={{
          padding: 2,
          justifyContent: "space-between",
          alignItems: "center"
        }}>
        <TextField
          label="Title"
          variant="standard"
          sx={{
            width: "50%",
          }}
          value={title}
          InputProps={{
            sx: {
              fontFamily: "monospace",
            },
          }}
          InputLabelProps={{
            sx: {
              fontFamily: "monospace",
            },
          }}
          onChange={handleChangeTitle}
        />
        <TextField
          label="Category"
          variant="standard"
          // To make the label of the TextField not overlap with the value.
          value={categoryName ? categoryName : ""}
          sx={{
            width: "25%",
          }}
          InputProps={{
            sx: {
              fontFamily: "monospace",
            },
            endAdornment: (
              <IconButton onClick={handleClickDropIcon}>
                <ArrowDropDownIcon />
              </IconButton>
            ),
          }}
          InputLabelProps={{
            sx: {
              fontFamily: "monospace",
            },
          }}
          onChange={handleChangeCategory}
        />
        <Menu
          anchorEl={anchorEl}
          open={openCategoryMenu}
          onClose={() => setAnchorEl(null)}>
          {existingCategories.map((existingCategory, index) => (
            <MenuItem
              key={index}
              onClick={(event) => handleClickCategoryItem(event)}>
              {existingCategory.name}
            </MenuItem>
          ))}
        </Menu>
        <Box sx={{ display: "flex", gap: 2 }}>
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
        </Box>
      </Stack>
      <MDEditor
        value={body}
        onChange={(event) => setBody(event || "")}
        height={1200}
      />
    </>
  );
}

export default Editor;
