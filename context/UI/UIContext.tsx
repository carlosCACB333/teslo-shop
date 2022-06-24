import { createContext, FC, PropsWithChildren, useEffect, useReducer } from "react";
import { UIReducer } from "./UIReducer";

interface UIContextProps {
  openMenu: boolean;
  mode: "dark" | "light";
  toggleMenu: () => void;
  toggletheme: () => void;
}

export interface UIState {
  openMenu: boolean;
  mode: "dark" | "light";
}

export const UI_INITIAL_STATE: UIState = {
  openMenu: false,
  mode: "dark",
};

export const UIContext = createContext<UIContextProps>({} as UIContextProps);

export const UIProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(UIReducer, UI_INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("mode", state.mode);
  }, [state.mode]);

  const toggleMenu = () => dispatch({ type: "menu_toggle" });
  const toggletheme = () => dispatch({ type: "theme_toggle" });
  return <UIContext.Provider value={{ ...state, toggleMenu, toggletheme }}>{children}</UIContext.Provider>;
};
