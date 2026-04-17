package com.smartparking.parkinglotservice.repository;

import com.smartparking.parkinglotservice.model.ParkingLot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParkingLotRepository extends JpaRepository<ParkingLot, Long> {
}
