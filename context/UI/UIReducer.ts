import { UIState } from "./UIContext";

type UIAction = { type: "menu_toggle" } | { type: "theme_toggle" };

export const UIReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case "menu_toggle":
      return { ...state, openMenu: !state.openMenu };

    case "theme_toggle":
      return { ...state, mode: state.mode === "dark" ? "light" : "dark" };
    default:
      return state;
  }
};
