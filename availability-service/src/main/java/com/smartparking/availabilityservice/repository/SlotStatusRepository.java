package com.smartparking.availabilityservice.repository;

import com.smartparking.availabilityservice.model.SlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SlotStatusRepository extends JpaRepository<SlotStatus, Long> {
    List<SlotStatus> findByParkingLotId(Long parkingLotId);
}
