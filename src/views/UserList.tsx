import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";

import type { User } from "../types/user";

type UserListProps = {
  users: Array<User>;
}

function UserList({ users }: UserListProps) {
  const onClickUser = (user: User) => {
    // TODO: user page
    // navigate(`/user/${user.id}`);
    console.log('User clicked:', user);
  };

  return (
    <Stack spacing={2} direction="column" sx={{ margin: 2 }}>
      {users.map((user) => (
        <Card
          variant="outlined"
          key={user.id}
          sx={{
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: 3,
              transform: 'translateY(-2px)'
            }
          }}
          onClick={() => onClickUser(user)}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar sx={{ width: 56, height: 56 }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h6" component="h3" gutterBottom>
                  {user.name}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

export default UserList;
