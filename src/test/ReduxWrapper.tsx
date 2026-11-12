
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../app/store";

interface ReduxWrapperProps {
  children: ReactNode;
}

const ReduxWrapper = ({ children }: ReduxWrapperProps) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export default ReduxWrapper;
