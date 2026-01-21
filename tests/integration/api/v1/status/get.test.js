test("GET /api/v1/status returns status 200 with expected body", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);
});
