# Admin Overview Dashboard

This plan addresses restructuring the Admin Dashboard to default to an analytical data view, exposing critical capacities and displaying user bookings natively, whilst preserving your previous ability to toggle into the "Management" interface.

## Goal Description

To create a powerful landing dashboard for Lot Owners to overview real-time statistics (Total Slots, Reserved Slots, Free Slots) per property. Alongside these metrics, active reservations will be explicitly listed with Booking Times and occupying User IDs. The interface will feature seamless tab navigation bridging the Overview and Management modes.

## User Review Required

> [!IMPORTANT]
> - By default, the `admin-dashboard` will launch in `overview` mode displaying mathematical sums. A new "Manage Lots" toggle will be inserted pushing to the previous form configuration. 
> - I will modify the Reservation Service API exclusively to allow fetching active reservations linked directly to a target `parkingLotId`.
> - Do you approve expanding the `ReservationRepository` queries to empower this dashboard?

## Proposed Changes

We will introduce updates bounding both backend Java Logic and Frontend structural execution.

---

### [Reservation Service]
Adding relational property extraction.
#### [MODIFY] `reservation-service/.../repository/ReservationRepository.java`
- Inject the mapped `findByParkingLotId(Long parkingLotId)` spring-data-jpa query execution.

#### [MODIFY] `reservation-service/.../controller/ReservationController.java`
- Establish `@GetMapping("/lot/{parkingLotId}")` endpoint logic cleanly linking the HTTP pipeline to our new repository execution wrapper.

---

### [Smart Parking UI]
Expanding Angular functionality without losing prior features.

#### [MODIFY] `smart-parking-ui/.../api.service.ts`
- Implement robust tracking hook `getLotReservations(lotId: number)` feeding off the gateway logic.

#### [MODIFY] `smart-parking-ui/.../admin-dashboard.component.ts`
- Inject state handlers `viewMode = 'overview'` overriding component templates.
- Process multiple asynchronous HTTP calls parsing lot availability counts mathematically.

#### [MODIFY] `smart-parking-ui/.../admin-dashboard.component.html`
- Design clean tab navigation headers mapping to our variable constraints.
- Implement an HTML data-table structurally outlining reservation contexts explicitly tied to the current looping iteration block. 

## Verification Plan

### Manual Verification
- Access the dashboard over Port 4200 authentically verifying the `OWNER` claim.
- Track metrics verifying the numbers adapt seamlessly when reservations trigger.
- Toggle back to Manage Lots to verify regression logic functions correctly without UI snapping errors.
