import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, FC, PropsWithChildren, useEffect, useReducer } from "react";
import { ax } from "../../api";
import { IErrors, IUser } from "../../interfaces";
import { AuthReducer } from "./AuthReducer";

interface AuthContextProps {
  isLoggedIn: boolean;
  user?: IUser;
  loginUser: (email: string, password: string) => Promise<undefined | IErrors>;
  signupUser: (name: string, email: string, password: string) => Promise<IErrors | undefined>;
  logoutUser: () => void;
}

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

export const Auth_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
};

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

interface ILoginRes {
  token: string;
  user: IUser;
}

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, Auth_INITIAL_STATE);
  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      dispatch({ type: "auth_login", payload: data.user as IUser });
    }
  }, [status, data]);

  // useEffect(() => {
  //   checkToken();
  // }, []);

  const loginUser = (email: string, password: string): Promise<undefined | IErrors> => {
    return ax
      .post<ILoginRes>("/user/login", { email, password })
      .then(({ data }) => {
        Cookies.set("token", data.token);
        dispatch({ type: "auth_login", payload: data.user });
        return undefined;
      })
      .catch((err: AxiosError<IErrors>) => {
        return err.response?.data!;
      });
  };

  const checkToken = () => {
    if (!Cookies.get("token")) return;
    ax.get<ILoginRes>("/user/validate-token")
      .then(({ data }) => {
        Cookies.set("token", data.token);
        dispatch({ type: "auth_login", payload: data.user });
      })
      .catch((e) => {
        console.log(e.response);
        // Cookies.remove("token");
      });
  };

  const signupUser = async (name: string, email: string, password: string): Promise<IErrors | undefined> => {
    try {
      const { data } = await ax.post<ILoginRes>("/user/signup", {
        email,
        password,
        name,
      });
      Cookies.set("token", data.token);
      dispatch({ type: "auth_login", payload: data.user });
      return undefined;
    } catch (error) {
      let err = error as AxiosError<IErrors>;
      return err.response?.data;
    }
  };

  const logoutUser = () => {
    // Cookies.remove("token");
    // router.reload();
    Cookies.remove("cart");
    signOut({ callbackUrl: "/" });
  };

  return <AuthContext.Provider value={{ ...state, loginUser, signupUser, logoutUser }}>{children}</AuthContext.Provider>;
};
