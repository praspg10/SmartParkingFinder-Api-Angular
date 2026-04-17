package com.smartparking.reservationservice.repository;

import com.smartparking.reservationservice.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findByParkingLotId(Long parkingLotId);
}
