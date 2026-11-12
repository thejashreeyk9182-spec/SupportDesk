
import { describe, it, expect } from "vitest";
import ticketReducer, {
  clearTicketError,
  setCurrentPage,
} from "./ticketSlice";

describe("Ticket Slice", () => {
  it("should return initial state", () => {
    const state = ticketReducer(undefined, { type: "unknown" });

    expect(state.tickets).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.submitting).toBe(false);
    expect(state.error).toBeNull();
    expect(state.total).toBe(0);
    expect(state.currentPage).toBe(1);
    expect(state.pageSize).toBe(5);
  });

  it("should update current page", () => {
    const state = ticketReducer(undefined, setCurrentPage(2));

    expect(state.currentPage).toBe(2);
  });

  it("should clear ticket error", () => {
    const initialState = {
      tickets: [],
      loading: false,
      submitting: false,
      error: "Something went wrong",
      total: 0,
      currentPage: 1,
      pageSize: 5,
    };

    const state = ticketReducer(initialState, clearTicketError());

    expect(state.error).toBeNull();
  });
});
