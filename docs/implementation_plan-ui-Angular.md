# Geolocation Search, Admin Dashboard, and Full Frontend Application

This plan addresses building out the Smart Parking Finder user interface screens and fulfilling the functional backend enhancements (geolocation search and admin dashboards).

## Goal Description

To create a visually stunning Angular-based web application that connects seamlessly to the existing microservices via the API Gateway. Concurrently, we will upgrade the `Parking Lot Service` to support mathematical geospatial filtering (geolocation search) and establish dedicated views for parking lot owners (Admin) to manage their properties.

## User Review Required

> [!IMPORTANT]
> - This plan proceeds with **Angular** for the browser frontend.
> - **Phase II (Android App)** is officially included in the roadmap. Our REST architecture makes integrating an Android client seamless because both the web browser and Android devices can consume the exact same Gateway endpoints!
> - I will use a **Haversine formula approximation in Java** within the Parking Lot Service to calculate and filter nearby parking lots. Because SQLite does not natively support geospatial indexing easily, this in-memory filtering method is perfectly efficient for the scale of this project. Do you approve this approach?
> - The UI will be built prioritizing premium design aesthetics (gradients, glassmorphism, dynamic animations) using strictly **Vanilla CSS** and bypassing utility frameworks like Tailwind depending on core constraints. 

## Proposed Changes

We will introduce a distinct frontend project directory and update existing Java components.

---

### [Parking Lot Service]
Adding geolocation capabilities.
#### [MODIFY] `parking-lot-service/.../controller/ParkingLotController.java`
- Update the `getNearbyParkingLots` endpoint to accept a `radius` parameter with a default of 10km.
- Implement the Haversine formula calculation to stream, filter, and only return parking lots that logically map within the physical radius of the provided latitude and longitude.

---

### [API Gateway]
Adding Cross-Origin Resource Sharing.
#### [MODIFY] `api-gateway/src/main/resources/application.properties`
- Add `spring.cloud.gateway.globalcors` declarations to permit the frontend access over port 5173 to bypass standard browser CORS restrictions when making API calls.

---

### [Smart Parking UI]
A brand new Angular environment built using the Angular CLI.

#### [NEW] `smart-parking-ui/`
We will scaffold the project inside a new directory using standard Angular tools.
- `package.json`: Angular dependencies. System uses standard Angular Router for client routing.

#### [NEW] `smart-parking-ui/.../styles.css`
A deep, cohesive design system containing variables (custom properties) mapped out for vibrant colors, smooth transitions, box-shadows, and glassmorphism panel styles to secure a premium user experience.

#### [NEW] UI Views
- `auth/login.component.ts`, `auth/register.component.ts`: Entry point for all users, dynamically handling JWT retrieval.
- `dashboard/user-dashboard.component.ts`: Features a geospatial mock-up interface to search nearby lots, view availability states, and securely click to register a Reservation with dynamic UI feedback.
- `dashboard/admin-dashboard.component.ts`: Restricted to `OWNER` logic. A rich data-table and control panel layout granting features to create new `ParkingLot` arrays and instantiate child `ParkingSlot` properties securely.

---

### [Phase II: Mobile Client Integration (Android)]
Because our system employs an independent API Gateway and Microservices, mobile devices can natively tap into the data.
- **Client-Agnostic Backend**: The API returns standard JSON and accepts JWT tokens via the `Authorization` header regardless of whether it's an internet browser or an Android client.
- **Phase II Roadmap**: Once the web implementation is secure, we will design an Android client that leverages standard networking libraries (like Retrofit with Kotlin). No core backend business logic will need to be altered specifically to support the mobile enhancement!

## Verification Plan

### Automated Tests
- Build and execute the Angular application using `npx ng serve`.

### Manual Verification
- View the UI through a modern web browser to test responsiveness and visual aesthetics.
- Verify user authentication and routing logic correctly directs `DRIVER` accounts to the User UI and `OWNER` accounts to the Admin Dashboard.
- Provide real-time interactions with Geolocation inputs tracking exactly filtered structures.
