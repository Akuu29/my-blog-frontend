import { useParams } from "react-router-dom";
import Stack from "@mui/material/Stack";

import ArticleDescription from "../components/ArticleDescription";
import { useContext } from "react";
import { UserStatusContext } from "../../../contexts/UserStatusContext";
import type { UserStatusContextProps } from "../../../types/user-status-context";
import CalendarWidget from "../../../components/layout/side-bar-widget/CalendarWidget/CalendarWidget";
import CategoryWidget from "../../../components/layout/side-bar-widget/CategoryWidget/CategoryWidget";

function ArticleByUser() {
  const { userId } = useParams();
  const userStatus = useContext(UserStatusContext) as UserStatusContextProps;

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

  const showAdminMenu = Boolean(userStatus.isLoggedIn && userStatus.currentUserId && userId && userStatus.currentUserId === userId);

  return (
    <ArticleDescription leftSideBar={left} rightSideBar={right} showAdminMenu={showAdminMenu} />
  );
}

export default ArticleByUser;
