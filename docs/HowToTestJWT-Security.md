# Deep Dive: Testing JWT Security & Implementation

This document breaks down the structural mechanics dictating how the Jason Web Token (JWT) is actively created, mapped, passed, and destroyed across the Smart Parking System's Angular and Java Spring layers.

## 1. Token Creation (Login Process)

The JWT is exclusively crafted natively within the domain boundaries of the `user-service`, preventing independent microservices from writing authorization constraints.

### The Code Pathway
1. **Input Payload**: The Angular UI (`login.component.ts`) triggers execution by transmitting JSON: `{"username": "AdminPPG", "password": "Password123"}` inside a standard `POST` request securely mapped securely into `http://localhost:8080/auth/login`.
2. **Route Configuration**: The `api-gateway` naturally catches the path mapping it through Eureka securely to the backend Java instance.
3. **Authentication Mapping (`user-service/AuthController.java`)**: 
   - Intercepts `@PostMapping("/login")`, handing the execution natively down into `AuthService.login()`.
   - The method reads the SQLite DB validating identical hashes securely via Spring Security's `PasswordEncoder`.
4. **Token Generation (`user-service/JwtUtil.java`)**:
   - Executes `generateToken(User user)`.
   - Generates a timestamp explicitly mapped to 24-hours (`86400000ms`).
   - Uses `Jwts.builder().setSubject()` injecting your raw native `User ID`.
   - Injects the role claiming parameter explicitly mapping `claim("role", user.getRole().name())`.
   - Signs it securely utilizing `HMAC-SHA256` encryption hashing against the standard application backend Secret Key variables.
5. **Output**: Java wraps the response natively returning successfully: `{"token": "eyJhbGciOiJIUzI1...etc"}`.

---

## 2. Token Embedded & Frontend Storage

Angular does not securely establish authenticated environments via Cookies, instead it relies inherently on localized memory binding.

### The Code Pathway
1. **Frontend Decoding (`login.component.ts`)**:
   - The UI grabs the raw string `res.token`. It saves the token organically into browser cache: `localStorage.setItem('token', res.token)`.
   - It runs an extraction map dynamically: `JSON.parse(atob(res.token.split('.')[1]))`. This explicitly rips out the Base64 JSON payload variables reading the embedded native fields!
   - Saves: `localStorage.setItem('role', payload.role)` & `localStorage.setItem('userId', payload.sub)`.
2. **Embedding the Map Natively (`api.service.ts`)**:
   - The class method `getHeaders()` is called dynamically prior to *every single* secured HTTP array.
   - It physically grabs the token string out of memory and constructs native `HttpHeaders` bindings structurally defined explicitly as:
   `{'Authorization': 'Bearer eyJhbGci...etc'}`.
   - Example UI Action: When you click "Reserve", Angular fires `this.http.post(url, payload, { headers: this.getHeaders() })`.

---

## 3. JWT Security Validation

The target native Microservices (`parking-lot-service`, `reservation-service`) structurally **DO NOT** validate security payloads at all! The API Gateway executes authentication interception globally.

### The Code Pathway
1. **Gateway Interception (`api-gateway/JwtAuthenticationFilter.java`)**:
   - Built explicitly as a global `GatewayFilter`. Except for routes mapped safely to `/auth/` algorithms natively or `OPTIONS` preflight hits, it aggressively seizes all routing processes seamlessly!
2. **Extraction Map**:
   - It fetches the native transmission header via `exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION)`.
3. **Validation Sequence (`api-gateway/JwtUtil.java`)**:
   - Removes the `"Bearer "` prefix parsing it securely down into identical `Jwts.parserBuilder()`.
   - Applies the identical backend `SECRET` decoding mapping mathematically processing the signature matching hook securely. 
   - If the token payload has expired cleanly or the mathematical signature is inherently malformed mathematically, it immediately skips the Eureka router securely crashing natively into a forced `401 Unauthorized` HTTP status!
   - If valid seamlessly, it maps the clean packet out the backend network into the target microservice cleanly bypassing constraints permanently.

---

## 4. Dashboard Protected Navigation

Because Angular is a native Single Page Application (SPA), jumping between HTML screens natively doesn't technically reload from the server physically! 

1. **Route Guarding**: In `admin-dashboard.component.ts` on `ngOnInit()`, the UI physically queries your configuration memory strictly looking for `localStorage.getItem('token')`.
2. **Redirection Hook**: If you type `/admin-dashboard` into the browser organically, but the memory checks fail or your `localStorage.getItem('role') !== 'OWNER'`, Angular forces the UI to block the rendering loop redirecting naturally backward seamlessly to `/login`.

---

## 5. The Logout Process

Because JWT arrays structurally represent isolated mathematically valid stateless cryptographic blocks internally generating without strict backend session arrays natively, **the server does NOT need to invalidate them**.

### Process
1. **User Objective**: The user clicks a Logout button effectively aiming to destroy security bounds.
2. **Action Trigger (`localStorage.removeItem()`)**:
   - Angular explicitly queries your browser physically ripping out the localized database hooks destroying `'token'`, `'role'`, and `'userId'` securely from `localStorage` immediately.
   - Angular flips its routing hook back strictly to `/login`.
3. **What happens to the Token?**:
   - Technically speaking, the mathematical token block physically remains valid server-side cleanly natively until its embedded `Timestamp + 24 hours` limit strictly expires dynamically!
   - However natively, because the localized client UI deleted its physical string securely, the browser inherently no longer possesses the authorization to dynamically build `getHeaders()`. Any subsequent HTTP actions seamlessly hit the Gateway completely empty-handed resulting actively securely terminating in a `401 Unauthorized` sequence organically!
