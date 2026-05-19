# GigFlow (Smart Leads Dashboard) — API Documentation

This API documentation details all HTTP endpoints, request payloads, response payloads, query parameters, verification mechanisms, and role constraints for the GigFlow / Smart Leads backend.

---

## 1. Global Specifications

### Base URL
All requests must be prefixed with:
```http
/api/v1
```
* **Development/Docker URL:** `http://localhost:5000/api/v1`
* **Vercel Production URL:** Configured during deployment (e.g. `https://sleads-backend.vercel.app/api/v1`)

### Headers
* `Content-Type: application/json` is required for all write operations (`POST`, `PATCH`, `PUT`).
* `Authorization: Bearer <JWT_TOKEN>` is required for all authenticated endpoints.

### Query Token Authentication (Special Bypass)
For endpoints serving binary data or downloads (like `GET /api/v1/leads/export/csv`), standard AJAX Authorization headers can be difficult to wire with native browser actions. Therefore, the API supports query token authorization:
* Query Parameter: `?token=<JWT_TOKEN>`
* When provided, the authentication middleware resolves the user context identical to a `Bearer` header token.

---

## 2. Standardized Response Format

To ensure predictability for the frontend client, the backend utilizes the `ApiResponse` utility class to format all JSON payloads into a strict envelope structure.

### Standard Success Response
```json
{
  "success": true,
  "message": "Resource fetched successfully",
  "data": {
    // ... payload object or array ...
  }
}
```

### Standard List/Paginated Response
```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [
    // ... array of items ...
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Standard Error Response
Depending on the error type, the `errors` object lists field-specific validation validation errors (from Zod) or general application warnings. Stack traces are omitted in production to avoid leaking server internals.
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": [
      "Invalid email address"
    ],
    "password": [
      "Password must be at least 6 characters"
    ]
  }
}
```

---

## 3. Role-Based Access Control (RBAC) Matrix

The system enforces strict route and service level verification based on user roles (`admin` or `sales`).

| Route Path | Method | Authentication Required | Allowed Roles | Business/Access Rules |
| :--- | :---: | :---: | :---: | :--- |
| `/auth/register` | `POST` | No | Public | Self-registration (defaults to `sales` role). |
| `/auth/login` | `POST` | No | Public | Standard email/password matching. |
| `/auth/logout` | `POST` | No | Public | Blacklists active token locally. |
| `/auth/me` | `GET` | Yes | `admin`, `sales` | Returns caller's user record. |
| `/leads` | `GET` | Yes | `admin`, `sales` | Fetches leads. Both roles can view all leads. |
| `/leads/:id` | `GET` | Yes | `admin`, `sales` | Fetches single lead by ID. |
| `/leads` | `POST` | Yes | `admin`, `sales` | Creates new lead. The caller is associated as `createdBy`. |
| `/leads/:id` | `PATCH` | Yes | `admin`, `sales` | `admin` can edit any lead. `sales` can **only** edit leads they created. |
| `/leads/:id` | `DELETE` | Yes | `admin` | Restricted at route level to `admin` users only. |
| `/leads/export/csv` | `GET` | Yes | `admin`, `sales` | Both roles can export CSVs respecting current filters. |

---

## 4. Endpoint Specifications

### Health Route

#### `GET /health`
Validates that the service is running and connected to database.
* **Authentication:** None
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Server is running",
    "data": {
      "status": "healthy",
      "timestamp": "2026-05-20T02:47:50.000Z",
      "uptime": 234.56
    }
  }
  ```

---

### Authentication Routes

#### `POST /auth/register`
Registers a new user account.
* **Authentication:** None
* **Payload Validation (Zod Schema):**
  ```ts
  name: string (min: 2, max: 50, required)
  email: string (valid email format, required)
  password: string (min: 6, max: 128, required)
  role: "admin" | "sales" (optional, defaults to "sales")
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "_id": "603f7e1b9b1d8e12ac41a39f",
        "name": "Jane Sales",
        "email": "jane@gigflow.io",
        "role": "sales",
        "createdAt": "2026-05-20T02:47:50.000Z",
        "updatedAt": "2026-05-20T02:47:50.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
* **Error Responses:**
  * `400 Bad Request` — Validation fail (e.g. short password).
  * `409 Conflict` — Email already registered.

#### `POST /auth/login`
Authenticates existing user and generates a JWT.
* **Authentication:** None
* **Payload Validation (Zod Schema):**
  ```ts
  email: string (valid email format, required)
  password: string (required)
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "_id": "603f7e1b9b1d8e12ac41a39f",
        "name": "Jane Sales",
        "email": "jane@gigflow.io",
        "role": "sales"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
* **Error Responses:**
  * `401 Unauthorized` — Invalid email or password.

#### `POST /auth/logout`
Revokes the caller's active JWT token.
* **Authentication:** Optional (resolves active token from Authorization header or cookies)
* **Access Rules:** Adds the caller's JWT to a file-backed local blacklist (`server/.token_blacklist.json`). This ensures token revocation survives server restarts in development.
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

#### `GET /auth/me`
Fetches the current authenticated user's session profile.
* **Authentication:** Required (`Bearer <JWT>` or cookie token)
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "User fetched successfully",
    "data": {
      "_id": "603f7e1b9b1d8e12ac41a39f",
      "name": "Jane Sales",
      "email": "jane@gigflow.io",
      "role": "sales",
      "createdAt": "2026-05-20T02:47:50.000Z",
      "updatedAt": "2026-05-20T02:47:50.000Z"
    }
  }
  ```

---

### Lead Management Routes

#### `GET /leads`
Fetches a paginated, sorted, and filtered list of leads.
* **Authentication:** Required
* **Query Parameters (Zod Verified):**
  * `status`: `"new" | "contacted" | "qualified" | "lost"` (optional)
  * `source`: `"website" | "instagram" | "referral"` (optional)
  * `search`: `string` (optional — performs case-insensitive regex search against `name` and `email`)
  * `sort`: `"latest" | "oldest"` (optional, defaults to `"latest"`)
  * `page`: `number` (optional, positive integer, defaults to `1`)
  * `limit`: `number` (optional, positive integer up to `100`, defaults to `10`)
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Leads fetched successfully",
    "data": [
      {
        "_id": "603f7f2b9b1d8e12ac41a4a1",
        "name": "Rahul Sharma",
        "email": "rahul@test.com",
        "status": "qualified",
        "source": "instagram",
        "createdBy": {
          "_id": "603f7e1b9b1d8e12ac41a39f",
          "name": "Jane Sales",
          "email": "jane@gigflow.io"
        },
        "createdAt": "2026-05-20T01:10:00.000Z",
        "updatedAt": "2026-05-20T01:15:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
  ```

#### `GET /leads/export/csv`
Generates a downloadable CSV containing leads matching active filters (ignoring page/limit pagination constraints).
* **Authentication:** Required (`Bearer <JWT>` or `?token=<JWT>` in URL query)
* **Query Parameters (Filter Synced):**
  * `status`: `"new" | "contacted" | "qualified" | "lost"` (optional)
  * `source`: `"website" | "instagram" | "referral"` (optional)
  * `search`: `string` (optional)
  * `sort`: `"latest" | "oldest"` (optional)
* **Headers Returned:**
  * `Content-Type: text/csv; charset=utf-8`
  * `Content-Disposition: attachment; filename="leads_export.csv"`
* **Success Response (200 OK - CSV String):**
  ```csv
  ID,Name,Email,Status,Source,Created By (Name),Created By (Email),Created At
  "603f7f2b9b1d8e12ac41a4a1","Rahul Sharma","rahul@test.com","qualified","instagram","Jane Sales","jane@gigflow.io","2026-05-20T01:10:00.000Z"
  ```

#### `GET /leads/:id`
Fetches a single lead by its object ID.
* **Authentication:** Required
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Lead fetched successfully",
    "data": {
      "_id": "603f7f2b9b1d8e12ac41a4a1",
      "name": "Rahul Sharma",
      "email": "rahul@test.com",
      "status": "qualified",
      "source": "instagram",
      "createdBy": {
        "_id": "603f7e1b9b1d8e12ac41a39f",
        "name": "Jane Sales",
        "email": "jane@gigflow.io"
      },
      "createdAt": "2026-05-20T01:10:00.000Z",
      "updatedAt": "2026-05-20T01:15:00.000Z"
    }
  }
  ```
* **Error Responses:**
  * `404 Not Found` — No lead matches the provided ID.
  * `400 Bad Request` — Invalid MongoDB Hex ID formatting.

#### `POST /leads`
Creates a new lead.
* **Authentication:** Required
* **Payload Validation (Zod Schema):**
  ```ts
  name: string (min: 2, max: 100, required)
  email: string (valid email format, required)
  status: "new" | "contacted" | "qualified" | "lost" (optional, defaults to "new")
  source: "website" | "instagram" | "referral" (required)
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Lead created successfully",
    "data": {
      "_id": "603f7f2b9b1d8e12ac41a4a1",
      "name": "Rahul Sharma",
      "email": "rahul@test.com",
      "status": "new",
      "source": "instagram",
      "createdBy": {
        "_id": "603f7e1b9b1d8e12ac41a39f",
        "name": "Jane Sales",
        "email": "jane@gigflow.io"
      },
      "createdAt": "2026-05-20T02:47:50.000Z",
      "updatedAt": "2026-05-20T02:47:50.000Z"
    }
  }
  ```

#### `PATCH /leads/:id`
Updates details of an existing lead.
* **Authentication:** Required
* **Access Rules:**
  * `admin` role: Can update any lead.
  * `sales` role: Can only update lead if `createdBy` matches their own user ID.
* **Payload Validation (Zod Schema):**
  ```ts
  name: string (min: 2, max: 100, optional)
  email: string (valid email format, optional)
  status: "new" | "contacted" | "qualified" | "lost" (optional)
  source: "website" | "instagram" | "referral" (optional)
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Lead updated successfully",
    "data": {
      "_id": "603f7f2b9b1d8e12ac41a4a1",
      "name": "Rahul Sharma Jr.",
      "email": "rahul@test.com",
      "status": "contacted",
      "source": "instagram",
      "createdBy": {
        "_id": "603f7e1b9b1d8e12ac41a39f",
        "name": "Jane Sales",
        "email": "jane@gigflow.io"
      },
      "createdAt": "2026-05-20T01:10:00.000Z",
      "updatedAt": "2026-05-20T02:47:50.000Z"
    }
  }
  ```
* **Error Responses:**
  * `403 Forbidden` — Sales user attempting to modify a lead they did not create.
  * `404 Not Found` — Lead not found.

#### `DELETE /leads/:id`
Deletes a lead from the system.
* **Authentication:** Required
* **Access Rules:** Restricted to the `admin` role at the route routing level.
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Lead deleted successfully",
    "data": null
  }
  ```
* **Error Responses:**
  * `403 Forbidden` — Caller role is `sales`.
  * `404 Not Found` — Lead not found.

---

## 5. Summary of Error Status Codes

* **`400 Bad Request`**: Malformed request structure, validation schema mismatches, or invalid Mongo ID structures.
* **`401 Unauthorized`**: Token missing, expired, blacklisted, or invalid signatures.
* **`403 Forbidden`**: Valid token provided, but insufficient user permissions (RBAC violation).
* **`404 Not Found`**: The requested resource route or data record does not exist.
* **`409 Conflict`**: Database constraint violations, such as creating a user with an email that is already registered.
* **`500 Internal Server Error`**: Unexpected runtime exceptions. Details are printed on the server console but masked in HTTP response envelopes.
