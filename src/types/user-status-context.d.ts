export type UserStatusContextProps = {
  isLoggedIn: boolean;
  isInitializing: boolean;
  currentUserId: string | null;
  currentUserName: string | null;
  updateIsLoggedIn: (value: boolean) => void;
  updateCurrentUserId: (id: string | null) => void;
  updateCurrentUserName: (name: string | null) => void;
};
