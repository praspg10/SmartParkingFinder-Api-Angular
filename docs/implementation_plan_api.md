# Smart Parking Finder System Architecture

This document describes the implementation plan to build the Smart Parking Finder system using a microservices architecture with Spring Boot, API Gateway, JWT authentication, and SQLite databases.

## Goal Description

To develop a distributed system that helps users find, reserve, and manage parking slots in real time, while allowing parking lot owners to manage their spaces. The system consists of an API Gateway and four distinct microservices: User Service, Parking Lot Service, Availability Service, and Reservation Service.

> [!IMPORTANT]
> The system will rely on SQLite for the independent databases to ensure loose coupling while minimizing the overhead of running standalone database servers for this implementation.

## User Review Required

- Approval required on the microservices communication approach (e.g., using `RestTemplate` vs `OpenFeign` for REST calls).
- Approval required on the use of Spring Cloud Gateway as the API Gateway.
- Approval on whether to include Spring Cloud Eureka for Service Discovery. It acts as a registry to dynamically route requests from API Gateway to services instead of hardcoding host URLs.

## Proposed Changes

We will create a parent Maven POM to manage the multi-module project layout and dependency versions, alongside the individual service modules.

### [Parent Project Setup]
#### [NEW] `pom.xml` (Root)
Parent POM containing `<modules>` for each microservice and dependency management for Spring Boot, Spring Cloud, etc.

---

### [API Gateway]
Single entry point that routes requests to underlying microservices and validates JWT tokens.
#### [NEW] `api-gateway/pom.xml`
Include `spring-cloud-starter-gateway`, `spring-boot-starter-security`, and `jjwt` dependencies.
#### [NEW] `api-gateway/src/main/resources/application.properties`
Configuration for routing rules (e.g., `/auth/**` -> User Service).
#### [NEW] `api-gateway/src/main/java/.../security/JwtAuthenticationFilter.java`
Global filter to extract, validate JWT tokens, and assert Role-Based Access Control logic.
#### [NEW] `api-gateway/src/main/java/.../ApiGatewayApplication.java`
Main Spring Boot bootstrap class.

---

### [User Service]
Handles registration, login, and JWT token issuance.
#### [NEW] `user-service/pom.xml`
Include Spring Web, Spring Security, Spring Data JPA, SQLite JDBC, JJWT.
#### [NEW] `user-service/src/main/resources/application.properties`
Config file pointing to `jdbc:sqlite:user_db.sqlite`.
#### [NEW] `user-service/src/main/java/.../model/User.java` and `Role.java`
Entities for storing user and role mapping.
#### [NEW] `user-service/src/main/java/.../controller/AuthController.java`
Endpoints: `POST /auth/register`, `POST /auth/login`.
#### [NEW] `user-service/src/main/java/.../service/AuthService.java`
Business logic verifying passwords and generating JWTs.

---

### [Parking Lot Service]
Manages parking lots and slots, offering geospatial search capabilities.
#### [NEW] `parking-lot-service/pom.xml`
Include Spring Web, Spring Data JPA, SQLite JDBC.
#### [NEW] `parking-lot-service/src/main/resources/application.properties`
Config file pointing to `jdbc:sqlite:parking_db.sqlite`.
#### [NEW] `parking-lot-service/src/main/java/.../model/ParkingLot.java` and `ParkingSlot.java`
Entities for parking entities.
#### [NEW] `parking-lot-service/src/main/java/.../controller/ParkingLotController.java`
Endpoints: `POST /parking-lots`, `GET /parking-lots`, `GET /parking-lots/nearby`, `POST /parking-lots/{id}/slots`.

---

### [Availability Service]
Tracks real-time slot availability.
#### [NEW] `availability-service/pom.xml`
Include Spring Web, Spring Data JPA, SQLite JDBC.
#### [NEW] `availability-service/src/main/resources/application.properties`
Config file pointing to `jdbc:sqlite:availability_db.sqlite`.
#### [NEW] `availability-service/src/main/java/.../model/SlotStatus.java`
Entity representing if a slot is currently RESERVED or FREE.
#### [NEW] `availability-service/src/main/java/.../controller/AvailabilityController.java`
Endpoints: `GET /availability/{parkingLotId}`, `PUT /availability/{slotId}/reserve`, `PUT /availability/{slotId}/free`.

---

### [Reservation Service]
System for creating and tracking reservations.
#### [NEW] `reservation-service/pom.xml`
Include Spring Web, Spring Data JPA, SQLite JDBC, and OpenFeign.
#### [NEW] `reservation-service/src/main/resources/application.properties`
Config file pointing to `jdbc:sqlite:reservation_db.sqlite`.
#### [NEW] `reservation-service/src/main/java/.../model/Reservation.java`
Entity for tracking user reservation.
#### [NEW] `reservation-service/src/main/java/.../controller/ReservationController.java`
Endpoints: `POST /reservations`, `GET /reservations/user/{userId}`, `PUT /reservations/{id}/cancel`.
#### [NEW] `reservation-service/src/main/java/.../client/AvailabilityClient.java`
Feign Client interface to communicate internally with the Availability Service to block a slot when a reservation is placed.

## Open Questions
> [!NOTE]
> Please review and respond to these questions:
1. By default, I will configure microservice-to-microservice communication using **Spring Cloud OpenFeign** for ease of use and declarative nature. Does this align with your preferences?
2. Do you want to include a **Service Discovery registry (like Eureka Server)** to let microservices discover each other locally without hardcoding host:port? If not, we will use static ports for each service (User on 8081, Parking on 8082, etc.) and configure the Gateway and Feign Clients manually with these static addresses.
3. For JWT generation, should we use a simple hardcoded symmetric secret for this implementation, or load an asymmetric RSA key pair?

## Verification Plan

### Automated Tests
- Boot up all microservices and the API gateway.
- Check actuator `/health` endpoints to ensure services are fully initialized and connected to their respective SQLite databases.

### Manual Verification
- Test User Registration & Login by calling the API Gateway `/auth/register` and `/auth/login` to secure a JWT.
- Attempt an unauthenticated request to `/parking-lots` and ensure it responds with `401 Unauthorized`.
- With a valid JWT, create a Parking Lot and Slots (acting as Lot Owner).
- Search for a parking lot (acting as User).
- Trigger a Reservation via `/reservations`, and verify that the `Availability Service` automatically updates the slot's status to Reserved.
