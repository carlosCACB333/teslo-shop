import { IUser } from "../../interfaces";
import { AuthState } from "./AuthContext";

type AuthAction =
  | { type: "auth_login"; payload: IUser }
  | { type: "auth_logout" };

export const AuthReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "auth_login":
      return { ...state, isLoggedIn: true, user: action.payload };
    case "auth_logout":
      return { ...state, isLoggedIn: false, user: undefined };
    default:
      return state;
  }
};
