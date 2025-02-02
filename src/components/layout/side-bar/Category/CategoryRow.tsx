import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { UserStatusContextProps } from "../../../../types/user-status-context";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";

import Result from "../../../../utils/result";
import LongMenu from "../../LongMenu";
import type { Category } from "../../../../types/category";

const OPTIONS = [
  "Edit",
  "Delete",
];

const DELETE_CONFIRM_MESSAGE = `Articles in this category will be moved to "None".
Are you sure you want to delete it?`;

function CategoryRow({
  category,
  userStatus,
  updateCategoryHandler,
  deleteCategoryHandler,
}: {
  category: Category,
  userStatus: UserStatusContextProps,
  updateCategoryHandler: (category: Category, editCategoryName: string) => Promise<Result<null, null>>,
  deleteCategoryHandler: (category: Category) => void,
}) {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState(category.name);

  const handleClickCategory = () => {
    navigate(`/category/${category.name}`);
  };

  const handleChangeEditCategoryName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditCategoryName(event.target.value);
  };

  const handleBlurEditCategoryName = async () => {
    const result = await updateCategoryHandler(category, editCategoryName);
    if (result.isErr()) setEditCategoryName(category.name);
    setIsEdit(false);
  };

  const handelKeyDownEditCategoryName = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const result = await updateCategoryHandler(category, editCategoryName);
      if (result.isErr()) setEditCategoryName(category.name);
      setIsEdit(false);
    }
  };

  const deleteCategory = () => {
    if (window.confirm(DELETE_CONFIRM_MESSAGE)) {
      deleteCategoryHandler(category);
    }
  };

  const handleClickMenuItem = (option: string) => {
    switch (option) {
      case "Edit":
        setIsEdit(true);
        break;
      case "Delete":
        deleteCategory();
        break;
      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}>
      <Box sx={{ flexGrow: 1 }}>
        {isEdit ? (
          <TextField
            variant="standard"
            value={editCategoryName}
            onChange={handleChangeEditCategoryName}
            onBlur={handleBlurEditCategoryName}
            onKeyDown={handelKeyDownEditCategoryName}
            autoFocus
          />
        ) : (
          <Link
            underline="hover"
            sx={{ cursor: "pointer" }}
            onClick={handleClickCategory}>
            <Typography
              sx={{
                m: 1,
                fontFamily: 'monospace',
              }}
              key={category.id}>
              {category.name}
            </Typography>
          </Link>
        )}
      </Box>
      {userStatus.isLoggedIn && (
        <LongMenu options={OPTIONS} clickMenuItemHandler={handleClickMenuItem} />
      )}
    </Box>
  );
}

export default CategoryRow;
