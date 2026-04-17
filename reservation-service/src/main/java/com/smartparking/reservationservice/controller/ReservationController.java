package com.smartparking.reservationservice.controller;

import com.smartparking.reservationservice.client.AvailabilityClient;
import com.smartparking.reservationservice.model.Reservation;
import com.smartparking.reservationservice.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final AvailabilityClient availabilityClient;

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation) {
        if (reservation.getSlotId() == null) {
            throw new IllegalArgumentException("Slot ID is required to create a reservation.");
        }
        reservation.setStatus("ACTIVE");
        reservation.setStartTime(LocalDateTime.now());
        
        Reservation savedReservation = reservationRepository.save(reservation);
        
        // Block the slot using Feign
        availabilityClient.reserveSlot(reservation.getSlotId());
        
        return ResponseEntity.ok(savedReservation);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reservation>> getUserReservations(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationRepository.findByUserId(userId));
    }

    @GetMapping("/lot/{parkingLotId}")
    public ResponseEntity<List<Reservation>> getLotReservations(@PathVariable Long parkingLotId) {
        return ResponseEntity.ok(reservationRepository.findByParkingLotId(parkingLotId));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        Reservation reservation = reservationRepository.findById(id).orElseThrow();
        reservation.setStatus("CANCELLED");
        reservationRepository.save(reservation);
        
        // Open the slot using Feign
        availabilityClient.freeSlot(reservation.getSlotId());
        
        return ResponseEntity.ok().build();
    }
}
