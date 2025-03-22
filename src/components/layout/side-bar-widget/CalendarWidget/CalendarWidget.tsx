import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Link from "@mui/material/Link";

import ArticleApi from "../../../../services/article-api";
import { Article } from "../../../../types/article";
import handleError from "../../../../utils/handle-error";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ErrorSnackbarContext } from "../../../../contexts/ErrorSnackbarContext";
import { ErrorSnackbarContextProps } from "../../../../types/error-snackbar-context";

const MONTH_LIST = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const theme = createTheme({
  typography: {
    fontFamily: 'monospace',
  },
});

function CalendarWidget() {
  const navigate = useNavigate();
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const [articles, setArticles] = useState<Array<Article>>([]);
  useEffect(() => {
    (async () => {
      const result = await ArticleApi.all();

      if (result.isOk()) {
        const body = result.unwrap();
        setArticles(body.items);
      } else if (result.isErr()) {
        handleError(result.unwrap(), navigate, openSnackbar, "top", "right");
        return;
      }
    })();
  }, [navigate, openSnackbar]);

  const [articlesByDate, setArticlesByDate] = useState<{ [key: string]: { [key: string]: Article[] } }>({});

  useEffect(() => {
    const groupedArticles: { [key: string]: { [key: string]: Array<Article> } } = {};

    articles.forEach(article => {
      const createdDate = new Date(article.createdAt);
      const year = createdDate.getFullYear().toString();
      const month = (createdDate.getMonth() + 1).toString().padStart(2, '0');

      if (!groupedArticles[year]) {
        groupedArticles[year] = {};
      }

      if (!groupedArticles[year][month]) {
        groupedArticles[year][month] = [];
      }

      groupedArticles[year][month].push(article);
    });

    setArticlesByDate(groupedArticles);
  }, [articles]);

  const handleClickArticle = (articleId: number) => {
    navigate(`/article/${articleId}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Typography sx={{
        fontFamily: 'monospace',
        variant: "h1",
        fontWeight: 600,
        p: 1,
      }}>
        Date
      </Typography>
      {Object.keys(articlesByDate).sort().reverse().map((year) => (
        <Accordion sx={{ m: 1 }} key={year}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}>
            <Typography>{year}</Typography>
          </AccordionSummary>
          {Object.keys(articlesByDate[year]).sort().reverse().map((month) => (
            <AccordionDetails key={month}>
              <Accordion elevation={0}>
                <AccordionSummary
                  expandIcon={<ArrowDropDownIcon />}>
                  <Typography>{MONTH_LIST[parseInt(month) - 1]}</Typography>
                </AccordionSummary>
                {articlesByDate[year][month].map((article) => (
                  <AccordionDetails key={article.id}>
                    <Typography>
                      <Link
                        underline="hover"
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleClickArticle(article.id)}
                      >
                        {article.title}
                      </Link>
                    </Typography>
                  </AccordionDetails>
                ))}
              </Accordion>
            </AccordionDetails>
          ))}
        </Accordion>
      ))}
    </ThemeProvider>
  );
}

export default CalendarWidget;
