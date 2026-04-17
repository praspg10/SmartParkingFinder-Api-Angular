package com.smartparking.availabilityservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class SlotStatus {
    @Id
    private Long slotId;
    
    private Long parkingLotId;
    private String slotNumber;
    private String status; // e.g. "FREE", "RESERVED"
}
