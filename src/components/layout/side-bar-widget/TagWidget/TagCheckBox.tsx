import React from "react";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import type { Tag } from "../../../../types/tag";

type TagCheckBoxProps = {
  tag: Tag,
  index: number,
  checked: boolean,
  onChange: () => void,
  adminMenu?: React.ReactNode,
}

function TagCheckBox({
  tag,
  index,
  checked,
  onChange,
  adminMenu,
}: TagCheckBoxProps) {
  return (
    <Box sx={{
      display: "flex",
    }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={onChange}
          />
        }
        label={tag.name}
        key={index}
      />
      {adminMenu}
    </Box>
  );
}

export default TagCheckBox;
