import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

type PageLayoutProps = {
  leftSideBar?: React.ReactNode;
  rightSideBar?: React.ReactNode;
  children: React.ReactNode;
};

function PageLayout({ leftSideBar, rightSideBar, children }: PageLayoutProps) {
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {leftSideBar && (
        <Grid item xs={12} md={2.5}>
          <Box sx={{ position: "sticky", top: 16 }}>
            {leftSideBar}
          </Box>
        </Grid>
      )}
      <Grid item
        xs={12}
        md={leftSideBar && rightSideBar ? 7 : (leftSideBar || rightSideBar ? 9.5 : 12)}>
        {children}
      </Grid>
      {rightSideBar && (
        <Grid item xs={12} md={2.5}>
          <Box sx={{ position: "sticky", top: 16 }}>
            {rightSideBar}
          </Box>
        </Grid>
      )}
    </Grid>
  );
}

export default PageLayout;
