import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Link from "@mui/material/Link";

import { articleApi } from "../../../../services/article-api";
import type { Article } from "../../../../types/article";
import type { PagedBody } from "../../../../types/paged-body";

const CALENDAR_STALE_TIME = 30 * 60 * 1000; // 30 min
const CALENDAR_GC_TIME = 2 * 60 * 60 * 1000; // 2 hours

const MONTH_LIST = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const theme = createTheme({
  typography: {
    fontFamily: 'monospace',
  },
});

type CalendarWidgetProps = {
  userId: string;
};

function CalendarWidget({ userId }: CalendarWidgetProps) {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["articles", "calendar", userId],
    queryFn: async () => {
      const result = await articleApi.all({ status: "published", userId });
      if (result.isErr()) throw result.unwrap();
      return (result.unwrap() as PagedBody<Article>).items;
    },
    staleTime: CALENDAR_STALE_TIME,
    gcTime: CALENDAR_GC_TIME,
    enabled: !!userId,
  });

  const articlesByDate = useMemo(() => {
    const grouped: { [year: string]: { [month: string]: Article[] } } = {};
    (data ?? []).forEach(article => {
      const date = new Date(article.createdAt);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      if (!grouped[year]) grouped[year] = {};
      if (!grouped[year][month]) grouped[year][month] = [];
      grouped[year][month].push(article);
    });
    return grouped;
  }, [data]);

  return (
    <ThemeProvider theme={theme}>
      <Typography sx={{ fontFamily: 'monospace', fontWeight: 600, p: 1 }}>
        Date
      </Typography>
      {Object.keys(articlesByDate).sort().reverse().map((year) => (
        <Accordion sx={{ m: 1 }} key={year}>
          <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
            <Typography>{year}</Typography>
          </AccordionSummary>
          {Object.keys(articlesByDate[year]).sort().reverse().map((month) => (
            <AccordionDetails key={month}>
              <Accordion elevation={0}>
                <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                  <Typography>{MONTH_LIST[parseInt(month) - 1]}</Typography>
                </AccordionSummary>
                {articlesByDate[year][month].map((article) => (
                  <AccordionDetails key={article.id}>
                    <Typography>
                      <Link
                        underline="hover"
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(`/user/${userId}/article/${article.id}`)}
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
