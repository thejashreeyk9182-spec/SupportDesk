
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

import Modal from "./Modal";

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

describe("Modal Component", () => {
  it("renders modal content when open", () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <Modal.Header>Ticket Details</Modal.Header>
        <Modal.Body>Ticket information</Modal.Body>
        <Modal.Footer>
          <button>Save</button>
        </Modal.Footer>
      </Modal>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Ticket Details")).toBeInTheDocument();
    expect(screen.getByText("Ticket information")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <Modal.Body>Hidden content</Modal.Body>
      </Modal>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when Escape key is pressed", () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose}>
        <Modal.Body>Ticket details</Modal.Body>
      </Modal>
    );

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when backdrop is clicked", () => {
    const onClose = vi.fn();

    const { container } = render(
      <Modal isOpen onClose={onClose}>
        <Modal.Body>Ticket details</Modal.Body>
      </Modal>
    );

    fireEvent.mouseDown(container.querySelector(".modal-overlay")!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when modal content is clicked", () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose}>
        <Modal.Body>Ticket details</Modal.Body>
      </Modal>
    );

    fireEvent.mouseDown(screen.getByRole("dialog"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("locks body scrolling when open", () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <Modal.Body>Ticket details</Modal.Body>
      </Modal>
    );

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body scrolling after unmount", () => {
    const { unmount } = render(
      <Modal isOpen onClose={vi.fn()}>
        <Modal.Body>Ticket details</Modal.Body>
      </Modal>
    );

    unmount();

    expect(document.body.style.overflow).toBe("");
  });

  it("closes using the Header close button", () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose}>
        <Modal.Header>Ticket Details</Modal.Header>
      </Modal>
    );

    fireEvent.click(screen.getByRole("button", { name: "Close modal" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("supports different modal sizes", () => {
    const { rerender, container } = render(
      <Modal isOpen onClose={vi.fn()} size="small">
        <Modal.Body>Small modal</Modal.Body>
      </Modal>
    );

    expect(container.querySelector(".modal-small")).toBeInTheDocument();

    rerender(
      <Modal isOpen onClose={vi.fn()} size="large">
        <Modal.Body>Large modal</Modal.Body>
      </Modal>
    );

    expect(container.querySelector(".modal-large")).toBeInTheDocument();
  });
});
