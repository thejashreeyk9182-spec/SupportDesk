import { render } from "@testing-library/react";
import ReduxWrapper from "./ReduxWrapper";

export const renderWithRedux = (ui: React.ReactElement) => {
  return render(ui, {
    wrapper: ReduxWrapper,
  });
};