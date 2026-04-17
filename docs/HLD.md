# High Level Design (HLD) Document

## 1. Introduction

The Smart Parking Finder platform transforms manual parking management into an automated, distributed software flow. Built around the microservices pattern, the system emphasizes scalability, distinct bounded contexts, and separation of concerns.

## 2. Design Principles

- **Microservice Autonomy**: Different services run in independent processes. A failure in the User process does not bring down the Parking process.
- **Database Partitioning**: Implements the Database per Service pattern using localized SQLite instances to completely sever hard relational dependencies. 
- **Synchronous Integration via Feign**: Utilizing Spring Cloud OpenFeign to bridge domain interactions in a robust abstraction layer.

## 3. High-Level Component Descriptions

### 3.1 API Gateway
Routing rules evaluate HTTP paths mapping them seamlessly to distinct upstream services. Includes the `JwtAuthenticationFilter` forming our zero-trust baseline interface for external requests.

### 3.2 User Service
Responsible for handling user identities, mapping passwords to credentials, securely storing accounts, and dispensing JSON Web Tokens signed correctly for RBAC access.
- **Data Model**: `User`

### 3.3 Parking Lot Service
Focused strictly on geospatial properties and structure ownership. It stores the metadata for physical boundaries, including parking spots mapping against them.
- **Data Model**: `ParkingLot`, `ParkingSlot`

### 3.4 Availability Service
A high-throughput service solely tracking the current boolean-equivalent states of specific slots (`FREE` vs `RESERVED`). Kept decoupled from physical structures to maintain real-time agility safely handling thousands of requests a minute.
- **Data Model**: `SlotStatus`

### 3.5 Reservation Service
Operates as the orchestration endpoint tying the user securely to the available hardware slot. Upon creation, it utilizes a Feign Client to explicitly command the Availability Service to block the chosen spot locally before fulfilling the transaction.
- **Data Model**: `Reservation`

## 4. Workflows

### Standard Reservation Workflow
1. Client requests a reservation slot allocation through the API Gateway, enclosing their JWT token.
2. Gateway verifies the token cryptographically. Request passed to `Reservation Service`.
3. `Reservation Service` creates a local active transaction mapping `userId` to `slotId`.
4. `Reservation Service` dispatches a blocking Feign call downstream: `PUT /availability/{slotId}/reserve`.
5. `Availability Service` executes the status adjustment in its independent database. Response returned.
6. Local transaction committed. Client successfully notified of reservation confirmation.
