import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeSanitize from "rehype-sanitize";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import { UserStatusContext } from "../../contexts/UserStatusContext";
import type { Article } from "../../types/article";
import type { UserStatusContextProps } from "../../types/user-status-context";

type ArticleListProps = {
  articles: Array<Article>;
}

function ArticleList({ articles }: ArticleListProps) {
  const navigate = useNavigate();
  const userStatus = useContext(UserStatusContext) as UserStatusContextProps;

  const onClickArticle = (article: Article) => {
    navigate(`/article/${article.id}`);
  };

  return (
    <Stack spacing={2} direction="column" sx={{ margin: 5 }}>
      {userStatus.isLoggedIn && (
        <IconButton
          disableRipple={true}
          sx={{
            cursor: "pointer"
          }}
          onClick={() => { navigate("/editor"); }}>
          <AddIcon />
          <Typography
            sx={{
              fontWeight: 600,
            }}>
            Add New Article
          </Typography>
        </IconButton>
      )}
      {articles.map((article => (
        <Card
          variant="elevation"
          key={article.id}
          sx={{ height: 230, padding: 1 }}
          onClick={() => onClickArticle(article)}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h4">
                {article.title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                {format(article.updatedAt, "MMMM dd, yyyy")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <div style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                wordBreak: "break-word",
                whiteSpace: "normal",
              }}>
                <MarkdownPreview
                  source={article.body}
                  style={{
                    backgroundColor: "transparent",
                    color: "inherit",
                    fontFamily: "string",
                  }}
                  skipHtml={true}
                  rehypePlugins={[rehypeSanitize]}
                />
              </div>
            </Grid>
          </Grid>
        </Card>
      )))}
    </Stack>
  );
}

export default ArticleList;
