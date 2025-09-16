export type UserStatusContextProps = {
  isLoggedIn: boolean;
  currentUserId: string | null;
  updateIsLoggedIn: (value: boolean) => void;
  updateCurrentUserId: (id: string | null) => void;
};
