import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";

import CategoryApi from "../../../../services/category-api";
import CategoryRow from "./CategoryRow";
import { UserStatusContext } from "../../../../contexts/UserStatusContext";
import { ErrorSnackbarContext } from "../../../../contexts/ErrorSnackbarContext";
import handleError from "../../../../utils/handle-error";
import Result from "../../../../utils/result";
import type { ErrorResponse } from "../../../../types/error-response";
import type { Category } from "../../../../types/category";
import type { UserStatusContextProps } from "../../../../types/user-status-context";
import type { ErrorSnackbarContextProps } from "../../../../types/error-snackbar-context";


const CATEGORY_PER_PAGE = 5;

function CategoryWidget() {
  const navigate = useNavigate();
  const userStatus = useContext(UserStatusContext) as UserStatusContextProps;
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;

  const [categories, setCategories] = useState<Array<Category>>([]);
  useEffect(() => {
    (async () => {
      const result = await CategoryApi.all({});

      if (result.isOk()) {
        setCategories(result.unwrap());
      }

      handleError((result.unwrap() as ErrorResponse), navigate, openSnackbar, "top", "right");

    })();

  }, [navigate, openSnackbar]);

  const deleteCategory = async (category: Category) => {
    const result = await CategoryApi.delete(category.id);

    if (result.isOk()) {
      setCategories(categories.filter((c) => c.id !== category.id));
    }

    handleError(result.unwrap() as ErrorResponse, navigate, openSnackbar, "top", "right");
  };

  const updateCategory = async (category: Category, editCategoryName: string): Promise<Result<null, null>> => {
    const result = await CategoryApi.update(category.id, { name: editCategoryName });

    if (result.isOk()) {
      setCategories(categories.map((c) => c.id === category.id ? result.unwrap() : c));

      return Result.ok(null);
    }

    handleError(result.unwrap() as ErrorResponse, navigate, openSnackbar, "top", "right");

    return Result.err(null);
  };

  const [addCategory, setAddCategory] = useState(false);
  const handleClickAddIcon = () => {
    setAddCategory(true);
  };
  const handleClickRemoveIcon = () => {
    setAddCategory(false);
  };

  const [page, setPage] = useState(1);
  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const startIndex = (page - 1) * CATEGORY_PER_PAGE;
  const endIndex = startIndex + CATEGORY_PER_PAGE;
  const paginatedCategories = categories.slice(startIndex, endIndex);

  const [newCategory, setNewCategory] = useState<string>("");

  const handleChangeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const category = data.get("category");

    if (category) {
      const result = await CategoryApi.create({ name: category as string });

      if (result.isOk()) {
        setCategories([...categories, result.unwrap()]);
        setNewCategory("");
      }

      handleError(result.unwrap() as ErrorResponse, navigate, openSnackbar, "top", "right");
    }
  };

  return (
    <>
      <Box sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1,
      }}>
        <Typography sx={{
          fontFamily: 'monospace',
          variant: "h1",
          fontWeight: 600,
        }}>
          Category
        </Typography>
        {userStatus.isLoggedIn && !addCategory && (
          <IconButton onClick={handleClickAddIcon}>
            <AddIcon />
          </IconButton>
        )}
        {userStatus.isLoggedIn && addCategory && (
          <IconButton onClick={handleClickRemoveIcon}>
            <RemoveIcon />
          </IconButton>
        )}
      </Box>
      {userStatus.isLoggedIn && addCategory && (
        <Box
          component={"form"}
          onSubmit={handleSubmit}
          sx={{
            p: 1,
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <TextField
            label="Add category"
            variant="standard"
            name="category"
            value={newCategory}
            onChange={handleChangeCategory}
            sx={{ flexGrow: 1, mr: 1, }}
          />
          <Button
            variant="outlined"
            type="submit"
          >
            Add
          </Button>
        </Box>
      )}
      {paginatedCategories.map((category) => (
        <CategoryRow
          category={category}
          userStatus={userStatus}
          updateCategoryHandler={updateCategory}
          deleteCategoryHandler={deleteCategory}
          key={category.id}
        />
      ))}
      {categories.length > 0 && (
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
        }} >
          <Pagination count={Math.ceil(categories.length / CATEGORY_PER_PAGE)} size="small" page={page} onChange={handleChangePage} />
        </Box>
      )}
    </>
  );
}

export default CategoryWidget;
