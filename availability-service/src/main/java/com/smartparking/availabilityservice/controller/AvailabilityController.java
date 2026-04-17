package com.smartparking.availabilityservice.controller;

import com.smartparking.availabilityservice.model.SlotStatus;
import com.smartparking.availabilityservice.repository.SlotStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/availability")
@RequiredArgsConstructor
public class AvailabilityController {

    private final SlotStatusRepository slotStatusRepository;

    @PostMapping
    public ResponseEntity<SlotStatus> addSlotStatus(@RequestBody SlotStatus slotStatus) {
        slotStatus.setStatus("FREE");
        return ResponseEntity.ok(slotStatusRepository.save(slotStatus));
    }

    @GetMapping("/{parkingLotId}")
    public ResponseEntity<List<SlotStatus>> getAvailability(@PathVariable Long parkingLotId) {
        return ResponseEntity.ok(slotStatusRepository.findByParkingLotId(parkingLotId));
    }

    @PutMapping("/{slotId}/reserve")
    public ResponseEntity<Void> reserveSlot(@PathVariable Long slotId) {
        SlotStatus status = slotStatusRepository.findById(slotId).orElseThrow();
        status.setStatus("RESERVED");
        slotStatusRepository.save(status);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{slotId}/free")
    public ResponseEntity<Void> freeSlot(@PathVariable Long slotId) {
        SlotStatus status = slotStatusRepository.findById(slotId).orElseThrow();
        status.setStatus("FREE");
        slotStatusRepository.save(status);
        return ResponseEntity.ok().build();
    }
}
