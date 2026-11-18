
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { useCallback, useState } from "react";

import useOutsideClick from "./useOutsideClick";

afterEach(cleanup);

function TestComponent({ onOutsideClick }: { onOutsideClick: () => void }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleOutsideClick = useCallback(() => {
    onOutsideClick();
    setIsOpen(false);
  }, [onOutsideClick]);

  const ref = useOutsideClick<HTMLDivElement>(handleOutsideClick);

  return (
    <div>
      <div ref={ref} data-testid="inside">
        {isOpen ? "Dropdown Open" : "Dropdown Closed"}
      </div>

      <button type="button" data-testid="outside">
        Outside
      </button>
    </div>
  );
}

describe("useOutsideClick", () => {
  it("calls callback when clicking outside", () => {
    const callback = vi.fn();

    render(<TestComponent onOutsideClick={callback} />);

    fireEvent.mouseDown(screen.getByTestId("outside"));

    expect(callback).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("inside")).toHaveTextContent("Dropdown Closed");
  });

  it("does not call callback when clicking inside", () => {
    const callback = vi.fn();

    render(<TestComponent onOutsideClick={callback} />);

    fireEvent.mouseDown(screen.getByTestId("inside"));

    expect(callback).not.toHaveBeenCalled();
  });
});
