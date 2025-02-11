import { ReactNode } from "react";
import Box from "@mui/material/Box";

type ArticleFieldProps = {
  children: ReactNode,
}

function ArticleField({ children }: ArticleFieldProps) {
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      gap: 1,
      width: "100%",
    }}>
      {children}
    </Box>
  );
}

export default ArticleField;
