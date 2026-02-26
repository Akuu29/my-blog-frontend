import { useParams } from "react-router-dom";
import Stack from "@mui/material/Stack";

import ArticleDescription from "../components/ArticleDescription";
import CalendarWidget from "../../../components/layout/side-bar-widget/CalendarWidget/CalendarWidget";
import CategoryWidget from "../../../components/layout/side-bar-widget/CategoryWidget/CategoryWidget";

function ArticleByUser() {
  const { userId } = useParams();

  const left = (
    <Stack spacing={1}>
      {userId && <CalendarWidget userId={userId} />}
    </Stack>
  );

  const right = (
    <Stack spacing={1}>
      {userId && <CategoryWidget userId={userId} />}
    </Stack>
  );

  return (
    <ArticleDescription leftSideBar={left} rightSideBar={right} />
  );
}

export default ArticleByUser;
