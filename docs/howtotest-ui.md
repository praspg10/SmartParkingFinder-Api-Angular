# Testing the Smart Parking Finder via Angular UI

This document provides a comprehensive end-to-end testing guide specifically focused on the Angular Unified Interface.

## 1. System Startup Sequence

To ensure the microservices can successfully load-balance and register with the backend, you explicitly must boot the servers in this sequential order:

### Backend Architecture
Run `mvn spring-boot:run` cleanly inside exactly these directories sequentially:
1. `discovery-server` (Wait until it bonds to Port 8761 natively before proceeding)
2. `user-service`
3. `parking-lot-service`
4. `availability-service`
5. `reservation-service`
6. `api-gateway` (Routes all microservices explicitly through Port 8080)

### Frontend Environment
Launch a terminal, navigate securely to standard `smart-parking-ui` repository:
```bash
npm install
npm start
```

**Execute the Environment**: Navigate to `http://localhost:4200` in your web browser securely.

---

## 2. Testing Scenarios: Lot Owner Workflow 

The Owner is responsible entirely for injecting the properties and slot capacities physically into the system.

### Scenario 2.1: Owner Registration & Access
* **Action**: Click "Don't have an account? Register". 
* **Input**: 
  - Username: `AdminPPG`
  - Password: `Password123`
  - Role: `OWNER`
* **Expected Result**: Successfully redirects dynamically to the Login page. Logging in strictly routes you directly to `/admin-dashboard`.

### Scenario 2.2: Creating Physical Properties
* **Action**: On the Admin Dashboard, click the **Manage Lots** tab.
* **Input**:
  - Name: `Southcenter Mall Hub`
  - Address: `536 Southcenter Mall, Tukwila, WA`
  - Latitude: `47.4585`
  - Longitude: `-122.2612`
* **Action**: Click "Create Lot".
* **Expected Result**: The text `Lot created successfully` appears beneath the button. Your new grid block "Southcenter Mall Hub" will automatically dynamically render strictly into the list recursively.

### Scenario 2.3: Initializing the Parking Infrastructure (Slots)
* **Action**: In your newly created grid block property, explicitly locate the small input bar next to "+ Add Slot".
* **Input**: Type `A-1`. Click `Add Slot`.
* **Input**: Type `A-2`. Click `Add Slot`.
* **Expected Result**: Success text will appear explicitly dropping securely under the property: `Slot A-2 added & set to FREE`. 

### Scenario 2.4: Validate Data Analytics Array
* **Action**: Click the **Overview** navigational tab spanning the top panel.
* **Expected Result**: Your property will natively display:
  - **Total Slots**: 2
  - **Free Slots**: 2
  - **Reserved Slots**: 0
  - **Active Reservations**: "No active reservations for this property."

---

## 3. Testing Scenarios: Driver Workflow

The Driver dynamically queries properties through geo-proximal mathematical loops securely requesting reservations natively.

### Scenario 3.1: Driver Registration & Search
* **Action**: Log out. Register a brand new completely isolated user account natively.
* **Input**: 
  - Username: `John_Driver`
  - Password: `Password123`
  - Role: `DRIVER`
* **Action**: Login securely.
* **Expected Result**: Safely navigates dynamically into explicitly the `/user-dashboard`. Optionally, it may prompt you securely granting HTML Geolocation permissions.

### Scenario 3.2: Geo-proximal Discovery
* **Action**: Look at the "Find Nearest Parking" box statically.
* **Input**: If geolocation was denied securely, type:
  - Latitude: `47.4500`
  - Longitude: `-122.2600`
  - Radius (km): `10`
* **Action**: Click `Search Nearby`.
* **Expected Result**: The backend will successfully calculate Haversine equations mapping and rendering the "Southcenter Mall Hub" specifically!

### Scenario 3.3: Booking a Parking Spot
* **Action**: Under the Mall property natively, click **Check Availability**.
* **Expected Result**: An array matrix will appear securely detailing two blocks: `A-1` and `A-2` seamlessly highlighting FREE globally.
* **Action**: Click `Reserve` explicitly underneath **Slot A-1**.
* **Expected Result**: The grid automatically hot-reloads asynchronously seamlessly hiding the Reserve hook and transforming strictly into a glowing Red `Cancel` payload interface exclusively locked directly onto Slot A-1!

### Scenario 3.4: Reverting & Freeing Capabilities
* **Action**: Click the newly transformed Red `Cancel` button spanning beneath Slot A-1!
* **Expected Result**: A success message fires. The array securely triggers an auto-refresh organically flipping the button back to green "FREE" and explicitly deleting dynamic reservation hooks completely. 

---

## 4. End-to-End System Validation (Owner View)

For the final layer, leave an active Driver payload specifically holding a grid lock to verify math arrays accurately propagate back to the Owner dashboard natively.

* **Action**: As `John_Driver`, organically Reserve `A-1` and explicitly log out without cancelling it securely.
* **Action**: Log strictly back in as `AdminPPG` natively querying the analytics view seamlessly.
* **Expected Result**: The Math interface natively tracks the metrics dynamically:
  - Total Slots: 2
  - Free Slots: 1
  - **Reserved Slots: 1**
  - **Active Reservations Array**: Will cleanly parse the SQL payload listing dynamically: "Slot ID: [ID]", matching natively bound exclusively directly to -> `User ID: [John_Driver]`.
