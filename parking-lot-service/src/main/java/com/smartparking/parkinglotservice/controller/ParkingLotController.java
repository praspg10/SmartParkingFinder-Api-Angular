package com.smartparking.parkinglotservice.controller;

import com.smartparking.parkinglotservice.model.ParkingLot;
import com.smartparking.parkinglotservice.model.ParkingSlot;
import com.smartparking.parkinglotservice.repository.ParkingLotRepository;
import com.smartparking.parkinglotservice.repository.ParkingSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/parking-lots")
@RequiredArgsConstructor
public class ParkingLotController {

    private final ParkingLotRepository parkingLotRepository;
    private final ParkingSlotRepository parkingSlotRepository;

    @PostMapping
    public ResponseEntity<ParkingLot> createParkingLot(@RequestBody ParkingLot parkingLot) {
        return ResponseEntity.ok(parkingLotRepository.save(parkingLot));
    }

    @GetMapping
    public ResponseEntity<List<ParkingLot>> getAllParkingLots() {
        return ResponseEntity.ok(parkingLotRepository.findAll());
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth Radius in Kilometers
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) 
                   + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) 
                   * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<ParkingLot>> getNearbyParkingLots(
            @RequestParam Double lat, 
            @RequestParam Double lng, 
            @RequestParam(required = false, defaultValue = "10.0") Double radiusKm) {
        
        List<ParkingLot> allLots = parkingLotRepository.findAll();
        List<ParkingLot> nearbyLots = allLots.stream()
                .filter(lot -> lot.getLatitude() != null && lot.getLongitude() != null)
                .filter(lot -> haversine(lat, lng, lot.getLatitude(), lot.getLongitude()) <= radiusKm)
                .toList();
                
        return ResponseEntity.ok(nearbyLots);
    }

    @PostMapping("/{id}/slots")
    public ResponseEntity<ParkingSlot> addSlot(@PathVariable Long id, @RequestBody ParkingSlot slot) {
        ParkingLot lot = parkingLotRepository.findById(id).orElseThrow();
        slot.setParkingLot(lot);
        return ResponseEntity.ok(parkingSlotRepository.save(slot));
    }
}
