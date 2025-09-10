import { useState, useEffect, useContext, useCallback, useRef } from "react";
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
import { ErrorSnackbarContext } from "../../../../contexts/ErrorSnackbarContext";
import handleError from "../../../../utils/handle-error";
import Result from "../../../../utils/result";
import type { Category, CategoryFilter } from "../../../../types/category";
import type { ErrorSnackbarContextProps } from "../../../../types/error-snackbar-context";

const CATEGORY_PER_PAGE = 5;

type CategoryWidgetProps = {
  userId: string;
  showAdminMenu?: boolean;
};

function CategoryWidget({ userId, showAdminMenu }: CategoryWidgetProps) {
  const navigate = useNavigate();
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const openSnackbarRef = useRef(openSnackbar);
  useEffect(() => { openSnackbarRef.current = openSnackbar; }, [openSnackbar]);

  const [categories, setCategories] = useState<Array<Category>>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const pageCount = Math.max(1, Math.ceil(total / CATEGORY_PER_PAGE));
  const loadPage = useCallback(async (targetPage: number) => {
    const offset = (targetPage - 1) * CATEGORY_PER_PAGE;
    const result = await CategoryApi.all(
      { userId } as CategoryFilter,
      { offset, perPage: CATEGORY_PER_PAGE }
    );

    if (result.isOk()) {
      const body = result.unwrap();
      setCategories(body.items);
      setTotal(body.total);
      setPage(targetPage);
    } else if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbarRef.current, "top", "right");
    }
  }, [userId, navigate]);

  useEffect(() => {
    (async () => {
      await loadPage(1);
    })();

  }, [navigate, userId, loadPage]);

  const deleteCategory = async (category: Category) => {
    const result = await CategoryApi.delete(category.id);

    if (result.isOk()) {
      setCategories(categories.filter((c) => c.id !== category.id));
    } else if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbarRef.current, "top", "right");
    }
  };

  const updateCategory = async (category: Category, editCategoryName: string): Promise<Result<null, null>> => {
    const result = await CategoryApi.update(category.id, { name: editCategoryName });

    if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbarRef.current, "top", "right");

      return Result.err(null);
    }

    setCategories(
      categories.map((c) => c.id === category.id ?
        (result.unwrap() as Category) : c)
    );

    return Result.ok(null);
  };

  const [addCategory, setAddCategory] = useState(false);
  const handleClickAddIcon = () => {
    setAddCategory(true);
  };
  const handleClickRemoveIcon = () => {
    setAddCategory(false);
  };

  const handleChangePage = async (_event: React.ChangeEvent<unknown>, newPage: number) => {
    await loadPage(newPage);
  };

  const [newCategory, setNewCategory] = useState<string>("");

  const handleChangeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const raw = data.get("category");
    const categoryName = typeof raw === "string" ? raw.trim() : "";

    if (!categoryName) {
      return;
    }

    const result = await CategoryApi.create({ name: categoryName });

    if (result.isOk()) {
      setCategories((prev) => [...prev, result.unwrap()]);
      setNewCategory("");
    } else if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbarRef.current, "top", "right");
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
        {showAdminMenu && !addCategory && (
          <IconButton onClick={handleClickAddIcon}>
            <AddIcon />
          </IconButton>
        )}
        {showAdminMenu && addCategory && (
          <IconButton onClick={handleClickRemoveIcon}>
            <RemoveIcon />
          </IconButton>
        )}
      </Box>
      {showAdminMenu && addCategory && (
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
      {categories.map((category) => (
        <CategoryRow
          category={category}
          updateCategoryHandler={updateCategory}
          deleteCategoryHandler={deleteCategory}
          key={category.id}
        />
      ))}
      {pageCount > 1 && (
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
        }} >
          <Pagination
            count={pageCount}
            page={page}
            onChange={handleChangePage}
            siblingCount={2}
            boundaryCount={1}
            color="primary"
            size="small"
          />
        </Box>
      )}
    </>
  );
}

export default CategoryWidget;
