import { test, expect } from "@playwright/test";

const rawApiBaseUrl = process.env.API_BASE_URL || "https://reqres.in/api";
const apiBaseUrl = rawApiBaseUrl.replace(/\/+$|\/api$/g, "") + "/api";
const apiEmail = process.env.API_EMAIL || "eve.holt@reqres.in";
const apiPassword = process.env.API_PASSWORD || "cityslicka";
const reqresApiKey = process.env.REQRES_API_KEY || "";

const jsonHeaders: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
};
if (reqresApiKey) {
  jsonHeaders["x-api-key"] = reqresApiKey;
}

test.describe("ReqRes API", () => {
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${apiBaseUrl}/login`, {
      headers: jsonHeaders,
      data: JSON.stringify({ email: apiEmail, password: apiPassword }),
    });

    const body = await response.json();
    expect(response.status(), `Login failed: ${JSON.stringify(body)}`).toBe(
      200,
    );
    expect(body).toHaveProperty("token");
  });

  test("authentication and session checks", async ({ request }) => {
    const response = await request.post(`${apiBaseUrl}/login`, {
      headers: jsonHeaders,
      data: JSON.stringify({ email: apiEmail, password: apiPassword }),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.token).toBeTruthy();
  });

  test("authentication failure with invalid credentials", async ({
    request,
  }) => {
    const response = await request.post(`${apiBaseUrl}/login`, {
      headers: jsonHeaders,
      data: JSON.stringify({
        email: "invalid@example.com",
        password: "wrongpass",
      }),
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty("error");
  });

  test("CRUD operations for users", async ({ request }) => {
    const createResponse = await request.post(`${apiBaseUrl}/users`, {
      headers: jsonHeaders,
      data: JSON.stringify({ name: "playwright", job: "tester" }),
    });
    expect(createResponse.status()).toBe(201);
    const createBody = await createResponse.json();
    expect(createBody).toMatchObject({ name: "playwright", job: "tester" });
    expect(createBody).toHaveProperty("id");

    const getResponse = await request.get(`${apiBaseUrl}/users/2`, {
      headers: jsonHeaders,
    });
    expect(getResponse.status()).toBe(200);
    const getBody = await getResponse.json();
    expect(getBody.data).toBeDefined();
    expect(getBody.data).toHaveProperty("id", 2);

    const updateResponse = await request.put(`${apiBaseUrl}/users/2`, {
      headers: jsonHeaders,
      data: JSON.stringify({
        name: "playwright-updated",
        job: "senior tester",
      }),
    });
    expect(updateResponse.status()).toBe(200);
    const updateBody = await updateResponse.json();
    expect(updateBody).toMatchObject({
      name: "playwright-updated",
      job: "senior tester",
    });

    const deleteResponse = await request.delete(`${apiBaseUrl}/users/2`, {
      headers: jsonHeaders,
    });
    expect(deleteResponse.status()).toBe(204);
  });

  test("error handling for 404 not found", async ({ request }) => {
    const response = await request.get(`${apiBaseUrl}/unknown/9999`, {
      headers: jsonHeaders,
    });
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body).toEqual({});
  });

  test("error handling for invalid payload", async ({ request }) => {
    const response = await request.post(`${apiBaseUrl}/register`, {
      headers: jsonHeaders,
      data: JSON.stringify({ email: apiEmail }),
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty("error");
  });

  test("method not allowed invalid method handling", async ({ request }) => {
    const response = await request.put(`${apiBaseUrl}/login`, {
      headers: jsonHeaders,
      data: JSON.stringify({ email: apiEmail, password: apiPassword }),
    });
    expect([404, 405]).toContain(response.status());
  });

  test("schema validation for GET list users", async ({ request }) => {
    const response = await request.get(`${apiBaseUrl}/users?page=2`, {
      headers: jsonHeaders,
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("page");
    expect(body).toHaveProperty("data");
    expect(Array.isArray(body.data)).toBe(true);
    if (body.data.length > 0) {
      expect(body.data[0]).toHaveProperty("id");
      expect(body.data[0]).toHaveProperty("email");
      expect(body.data[0]).toHaveProperty("first_name");
      expect(body.data[0]).toHaveProperty("last_name");
    }
  });

  test("schema validation for POST create user", async ({ request }) => {
    const response = await request.post(`${apiBaseUrl}/users`, {
      headers: jsonHeaders,
      data: JSON.stringify({ name: "playwright", job: "tester" }),
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("createdAt");
    expect(body.name).toBe("playwright");
    expect(body.job).toBe("tester");
  });

  test("schema validation for failed login", async ({ request }) => {
    const response = await request.post(`${apiBaseUrl}/login`, {
      headers: jsonHeaders,
      data: JSON.stringify({ email: apiEmail }),
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty("error");
  });

  test("rate limiting detection if supported", async ({ request }) => {
    const responses = [];
    for (let i = 0; i < 5; i++) {
      responses.push(
        await request.get(`${apiBaseUrl}/users?page=1`, {
          headers: jsonHeaders,
        }),
      );
    }

    const statuses = responses.map((res) => res.status());
    expect(statuses.some((status) => status === 429)).toBe(false);
  });
});
