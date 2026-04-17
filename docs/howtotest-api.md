# How to Test the Smart Parking Finder Application

This document provides step-by-step instructions on how to start and test the Smart Parking Finder application locally.

## 1. Starting the Application

The application consists of multiple microservices. You will need to start them in the following order using Maven. You can run these commands from the root directory by changing into each respective directory first.

### Step 1.1: Start Discovery Server
```bash
cd discovery-server
mvn clean spring-boot:run
```

### Step 1.2: Start API Gateway
```bash
cd api-gateway
mvn clean spring-boot:run
```

### Step 1.3: Start the Microservices
Open a new terminal for each of the following services and start them:
```bash
cd user-service
mvn clean spring-boot:run
```
```bash
cd parking-lot-service
mvn clean spring-boot:run
```
```bash
cd availability-service
mvn clean spring-boot:run
```
```bash
cd reservation-service
mvn clean spring-boot:run
```

> [!IMPORTANT]
> Ensure all microservices have successfully registered with the Eureka Server (accessible at `http://localhost:8761`).

---

## 2. API Endpoints & Sample Testing

The API Gateway runs on `localhost:8080`. All API requests should be sent to the Gateway, which will route them to the appropriate underlying microservice. You can use tools like Postman, Insomnia, or simple `curl` commands to test these endpoints.

### 2.1 User Registration (`User Service`)
**URL:** `POST http://localhost:8080/auth/register`
**Objective:** Register a new user with a specific role.
**Sample JSON Body:**
```json
{
    "username": "johndoe",
    "password": "securepassword123",
    "role": "DRIVER"
}
```
*Note: Roles can be `DRIVER`, `OWNER`, or `ADMIN`.*

### 2.2 User Login (`User Service`)
**URL:** `POST http://localhost:8080/auth/login`
**Objective:** Authenticate a user and receive a JWT token.
**Sample JSON Body:**
```json
{
    "username": "johndoe",
    "password": "securepassword123"
}
```
**Expected Output:** You will receive an `AuthResponse` containing a JWT `token`. **Copy this token**, as it will be required to authenticate subsequent requests by adding it to the `Authorization` header as `Bearer <your_token>`.

### 2.3 Create a Parking Lot (`Parking Lot Service`)
*Requires valid JWT Token in `Authorization` Header.*
**URL:** `POST http://localhost:8080/parking-lots`
**Sample JSON Body:**
```json
{
    "name": "Downtown Premium Plaza",
    "address": "123 Main St, City Center",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "ownerId": 1
}
```
**Expected Output:** The created parking lot object with an auto-generated `id` (e.g., `id: 1`).

### 2.4 Add a Slot to Parking Lot (`Parking Lot Service`)
*Requires valid JWT Token in `Authorization` Header.*
**URL:** `POST http://localhost:8080/parking-lots/1/slots`
*(Assuming the parking lot ID created in the previous step is `1`)*
**Sample JSON Body:**
```json
{
    "slotNumber": "A-101"
}
```
**Expected Output:** The corresponding parking slot saved with an auto-generated `id`.

### 2.5 Add Initial Availability for the Slot (`Availability Service`)
*Requires valid JWT Token in `Authorization` Header.*
**URL:** `POST http://localhost:8080/availability`
**Sample JSON Body:**
```json
{
    "parkingLotId": 1,
    "slotId": 1
}
```
**Expected Output:** The created `SlotStatus` structure, its status will default to `FREE`.

### 2.6 Check Availability (`Availability Service`)
**URL:** `GET http://localhost:8080/availability/1`
*(Where 1 is the parkingLotId)*
**Expected Output:** A list of `SlotStatus` objects associated with that parking lot and their corresponding states (`FREE`, `RESERVED`).

### 2.7 Create a Reservation (`Reservation Service`)
*Requires valid JWT Token in `Authorization` Header.*
**URL:** `POST http://localhost:8080/reservations`
**Sample JSON Body:**
```json
{
    "userId": 1,
    "slotId": 1
}
```
**Expected Output:** The system creates an `ACTIVE` reservation and automatically pushes a Feign Client update to the Availability Service to transition slot ID `1` to `RESERVED`. 

*You can verify this automatically happened by calling the Check Availability endpoint (2.6) again.*

### 2.8 Cancel a Reservation (`Reservation Service`)
*Requires valid JWT Token in `Authorization` Header.*
**URL:** `PUT http://localhost:8080/reservations/1/cancel`
*(Assuming the reservation id is 1)*
**Expected Output:** Returns a 200 OK. The Reservation status sets to `CANCELLED` and triggers OpenFeign to notify the Availability Service to set the slot status back to `FREE`.



###SAMPLE DATA
1. Parking Lots Metadata (SQL/CSV Structure)
This table defines the parking lots, their locations, and capacity. 
lot_id	lot_name	address	latitude	longitude	total_spots
P001	South Renton P&R	205 S 7th St, Renton, WA 98057	47.4789	-122.2135	150
P002	City Center Garage	655 S 2nd St, Renton, WA 98057	47.4815	-122.2100	300
P003	West Southcenter	536 Southcenter Mall, Tukwila, WA	47.4585	-122.2612	500
P004	Angle Lake Station	19940 28th Ave S, SeaTac, WA	47.4335	-122.2965	1160
P005	Tibbetts Lot P&R	2nd Ave N & Mercer, Renton, WA



 "username": "PrasPPG",
"password": "PrasPPG123"

