import React from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";

function TagList({
  children,
}: {
  children: React.ReactNode
}) {
  const childNodeArray = React.Children.toArray(children);
  const leftRow = childNodeArray.filter((_child, index) => index % 2 === 0);
  const rightRow = childNodeArray.filter((_child, index) => index % 2 === 1);

  return (
    <Box sx={{ display: "flex" }}>
      <FormControl sx={{ m: 2 }} component="fieldset" variant="standard">
        <FormGroup>
          {leftRow}
        </FormGroup>
      </FormControl>
      <FormControl sx={{ m: 2 }} component="fieldset" variant="standard">
        <FormGroup>
          {rightRow}
        </FormGroup>
      </FormControl>
    </Box>
  );
}

export default TagList;
