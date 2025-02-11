import { useState, MouseEvent, ChangeEvent } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

type ArticleCategorySelectorProps = {
  existingCategories: Array<{ id: number; name: string }>;
  categoryName: string | undefined;
  setCategoryName: (categoryName: string | undefined) => void;
}

function ArticleCategorySelector({ existingCategories, categoryName, setCategoryName }: ArticleCategorySelectorProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const onClickDropIcon = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onChangeCategory = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCategoryName(event.target.value);
  };

  const onClickCategoryItem = (event: MouseEvent<HTMLElement>) => {
    setCategoryName(event.currentTarget.textContent || undefined);
    setAnchorEl(null);
  };

  return (
    <Box sx={{
      display: "flex",
      justifyContent: "flex-end",
      width: "100%",
    }}>
      <TextField
        label="Category"
        variant="standard"
        // To make the label of the TextField not overlap with the value.
        value={categoryName ? categoryName : ""}
        sx={{
          marginRight: "auto",
          marginLeft: "auto",
          width: "70%"
        }}
        InputProps={{
          endAdornment: (
            <IconButton onClick={onClickDropIcon}>
              <ArrowDropDownIcon />
            </IconButton>
          ),
        }}
        onChange={onChangeCategory}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}>
        {existingCategories.map((existingCategory, index) => (
          <MenuItem
            key={index}
            onClick={onClickCategoryItem}>
            {existingCategory.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default ArticleCategorySelector;
