package com.smartparking.parkinglotservice.repository;

import com.smartparking.parkinglotservice.model.ParkingSlot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParkingSlotRepository extends JpaRepository<ParkingSlot, Long> {
}
