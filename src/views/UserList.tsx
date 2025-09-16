import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Avatar from "@mui/material/Avatar";

import type { User } from "../types/user";

type UserListProps = {
  users: Array<User>;
}

function UserList({ users }: UserListProps) {
  const navigate = useNavigate();
  const onClickUser = (user: User) => {
    navigate(`/user/${user.id}/articles`, { state: { userName: user.name } });
  };

  return (
    <Stack spacing={2} direction="column" sx={{ margin: 2 }}>
      {users.map((user) => (
        <Card
          variant="outlined"
          key={user.id}
          sx={{
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: 3,
              transform: 'translateY(-2px)'
            }
          }}
        >
          <CardActionArea onClick={() => onClickUser(user)} aria-label={`Open user: ${user.name}`}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar sx={{ width: 56, height: 56 }}>
                    {(user.name?.trim?.().charAt(0) || "?").toUpperCase()}
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {user.name}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Stack>
  );
}

export default UserList;
