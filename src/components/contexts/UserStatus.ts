import { createContext } from "react";

const isLogin = false;

const UserStatusContext = createContext(isLogin);

export default UserStatusContext;
