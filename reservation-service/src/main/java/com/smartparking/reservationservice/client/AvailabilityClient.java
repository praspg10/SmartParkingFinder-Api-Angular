package com.smartparking.reservationservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@FeignClient(name = "availability-service")
public interface AvailabilityClient {

    @PutMapping("/availability/{slotId}/reserve")
    void reserveSlot(@PathVariable("slotId") Long slotId);

    @PutMapping("/availability/{slotId}/free")
    void freeSlot(@PathVariable("slotId") Long slotId);
}
