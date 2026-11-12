import { http, HttpResponse } from "msw";

const API_URL = "http://localhost:5000";

export const handlers = [
  // Get tickets
  http.get(`${API_URL}/tickets`, () => {
    return HttpResponse.json([
      {
        id: "T101",
        customerName: "Rahul Sharma",
        email: "rahul@gmail.com",
        subject: "Payment Failed",
        description: "Payment issue",
        priority: "High",
        status: "Open",
        createdAt: "2026-11-03T10:00:00.000Z",
      },
    ]);
  }),

  // Create ticket
  http.post(`${API_URL}/tickets`, async ({ request }) => {
    const body = await request.json();

    return HttpResponse.json(body, {
      status: 201,
    });
  }),
];