import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {
  lat = 40.7128;
  lng = -74.0060;
  radius = 10;
  
  lots: any[] = [];
  selectedLotId: number | null = null;
  availability: any[] = [];
  msg = '';
  reservations: any[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    if(!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    } else {
      this.getUserLocation();
      this.loadReservations();
    }
  }
  get currentUserId(): number {
    return Number(localStorage.getItem('userId')) || 1;
  }
  
  loadReservations() {
    this.api.getUserReservations(this.currentUserId).subscribe({ 
      next: (res) => this.reservations = res,
      error: (e) => console.error('Failed to load reservations')
    });
  }

  getMyReservation(slotId: number): any {
    return this.reservations.find(r => r.slotId === slotId && r.status === 'ACTIVE');
  }

  cancelReservation(reservationId: number) {
    this.api.cancelReservation(reservationId).subscribe({
      next: () => {
        this.msg = 'Reservation cancelled successfully!';
        this.loadReservations();
        if (this.selectedLotId) {
           this.checkAvailability(this.selectedLotId);
        }
      },
      error: (e) => this.msg = 'Failed to cancel reservation.'
    });
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        },
        (error) => {
          console.warn('Geolocation failed or denied. Falling back to default coordinates.', error);
        }
      );
    } else {
      console.warn('Browser does not support Geolocation');
    }
  }

  searchLots() {
    this.selectedLotId = null;
    this.api.getNearbyParkingLots(this.lat, this.lng, this.radius).subscribe({
      next: (res) => this.lots = res,
      error: (e) => console.error(e)
    });
  }

  checkAvailability(lotId: number) {
    this.selectedLotId = lotId;
    this.availability = [];
    this.msg = '';
    this.api.getAvailability(lotId).subscribe({
      next: (res) => this.availability = res,
      error: (e) => console.error(e)
    });
  }

  reserveSlot(slotId: number) {
    this.api.createReservation(this.currentUserId, slotId, this.selectedLotId!).subscribe({
      next: () => {
        this.msg = 'Successfully reserved slot!';
        this.loadReservations(); // MUST DO THIS FIRST
        this.checkAvailability(this.selectedLotId!);
      },
      error: (e) => this.msg = 'Failed to reserve.'
    });
  }
}
