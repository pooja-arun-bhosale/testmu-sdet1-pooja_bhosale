# ReqRes API Test Plan

## Application Overview

ReqRes REST API test plan using the configured API_BASE_URL, covering auth, CRUD, error handling, rate limiting, and response schema validation.

## Test Scenarios

### 1. ReqRes API

**Seed:** `tests/seed.spec.ts`

#### 1.1. Authentication and session checks

**File:** `specs/api.md`

**Steps:**

1. Send a login/auth request to the ReqRes auth endpoint using valid credentials.


    - expect: The API responds with a success status and a token or session value.

2. Send an auth request with missing or invalid credentials.


    - expect: The API responds with a 4xx status and an error message indicating authentication failure.

#### 1.2. CRUD operations

**File:** `specs/api.md`

**Steps:**

1. Create a new user/resource using a POST request.


    - expect: The API returns a 201 Created response with the created object and its ID.

2. Retrieve the created resource using a GET request.


    - expect: The API returns the expected resource data and matching ID.

3. Update the resource using PUT or PATCH.


    - expect: The API returns a successful response and the updated fields are present.

4. Delete the resource using DELETE.


    - expect: The API returns a success status and the resource is no longer retrievable.

#### 1.3. Error handling for 4xx and 5xx responses

**File:** `specs/api.md`

**Steps:**

1. Request a non-existent resource to trigger a 404 response.


    - expect: The API returns a 404 Not Found status with a descriptive error body.

2. Send a request with invalid payload or missing required fields.


    - expect: The API returns a 4xx validation error and a helpful error message.

3. Attempt an invalid method on a valid endpoint to trigger a 4xx error.


    - expect: The API returns the correct 4xx status and a clear explanation of the invalid method.

4. Simulate a 5xx server error if the API supports a test endpoint or malformed request pattern.


    - expect: A 5xx status is returned and the error response is handled gracefully in the client.

#### 1.4. Rate limiting and throttling

**File:** `specs/api.md`

**Steps:**

1. Send repeated API requests in a short period to detect any rate limiting.


    - expect: If supported, the API responds with a 429 Too Many Requests or rate limit signal.

2. Respect the rate limit headers, if present, and retry after the specified delay.


    - expect: The client observes the retry-after behavior and successfully resumes after the limit window.

#### 1.5. Schema validation

**File:** `specs/api.md`

**Steps:**

1. Validate the JSON response schema for a successful GET request.


    - expect: The response contains all required fields with correct data types.

2. Validate the schema for a successful POST creation response.


    - expect: The response includes expected fields such as id, createdAt, name, and job when applicable.

3. Validate error response schema for failed requests.


    - expect: Error responses follow the expected schema and include error or message fields.
