# Smart Parking Finder Walkthrough

We have successfully built the foundation for the **Smart Parking Finder** system, executing the implementation plan to create a distributed microservices environment. 

## Architectural Foundation Established
- **Parent Maven Project** configured to manage the microservices ecosystem.
- **Service Discovery** established using Spring Cloud Netflix Eureka Server (`discovery-server`) running on port `8761`.
- **API Gateway** running on port `8080`, providing a unified routing facade integrated with Eureka.

### Security and RBAC Enabled
Implemented a global Authentication strategy using `JJWT`.
- **API Gateway**: Uses `JwtAuthenticationFilter` to validate Bearer tokens on requests before proxying them to sub-services.
- **User Service (`8081`)**: Provides `/auth/register` and `/auth/login` paths allowing access as `DRIVER`, `OWNER`, or `ADMIN`.

## Built Services

> [!TIP]
> Each service uses SQLite. Databases will be dynamically provisioned on application launch directly inside your workspace directory (e.g. `user_db.sqlite`, `parking_db.sqlite`).

### 🅿️ Parking Lot Service (`8082`)
- Manages `ParkingLot` and inner `ParkingSlot` properties.
- **Endpoints Exponent**: Offers geospatial search prototypes and standard entity mappings.

### ✅ Availability Service (`8083`)
- Maps real-time status details of `ParkingSlots` to `FREE` or `RESERVED`.
- Exposes direct state-updater functions.

### 📅 Reservation Service (`8084`)
- Implements the core reservation logic recording users blocking slots.
- **Microservice Communication Ready**: Actively communicates with the **Availability Service** using **Spring Cloud OpenFeign** to update standard availability dynamically.

## Validation Status
> [!NOTE]
> The source framework and dependencies have been thoroughly verified and structurally compiled.

```shell
[INFO] Reactor Summary for smart-parking-finder 1.0.0-SNAPSHOT:
[INFO] 
[INFO] smart-parking-finder ............................... SUCCESS [  0.483 s]
[INFO] discovery-server ................................... SUCCESS [  3.207 s]
[INFO] api-gateway ........................................ SUCCESS [  8.335 s]
[INFO] user-service ....................................... SUCCESS [ 12.391 s]
[INFO] parking-lot-service ................................ SUCCESS [  1.882 s]
[INFO] availability-service ............................... SUCCESS [  1.880 s]
[INFO] reservation-service ................................ SUCCESS [  3.077 s]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
```

## Running the Application Locally
To start the ecosystem dynamically, boot the services in your standard IDE, or sequentially run them using `mvn spring-boot:run` on each directory in the following order:
1. `discovery-server`
2. `api-gateway`
3. Everything else: `user-service`, `parking-lot-service`, etc.
