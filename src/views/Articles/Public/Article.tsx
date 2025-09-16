import Stack from "@mui/material/Stack";
import ArticleDescription from "../components/ArticleDescription";

function Article() {
  const left = (
    <Stack spacing={1}>
      {/* reserved for future widgets */}
    </Stack>
  );

  const right = (
    <Stack spacing={1}>
      {/* reserved for future widgets */}
    </Stack>
  );

  return (
    <ArticleDescription leftSideBar={left} rightSideBar={right} />
  );
}

export default Article;
