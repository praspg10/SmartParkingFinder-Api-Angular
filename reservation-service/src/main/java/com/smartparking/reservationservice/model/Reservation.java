package com.smartparking.reservationservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long slotId;
    private Long parkingLotId;
    
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    
    private String status; // "ACTIVE", "CANCELLED", "COMPLETED"
}
