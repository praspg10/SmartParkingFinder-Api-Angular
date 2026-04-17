import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Auth Methods
  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userId}`, { headers: this.getHeaders() });
  }

  // Parking Lot Methods
  getNearbyParkingLots(lat: number, lng: number, radiusKm: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/parking-lots/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`, { headers: this.getHeaders() });
  }

  getAllParkingLots(): Observable<any> {
    return this.http.get(`${this.baseUrl}/parking-lots`, { headers: this.getHeaders() });
  }

  createParkingLot(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/parking-lots`, data, { headers: this.getHeaders() });
  }

  addSlot(parkingLotId: number, slotNumber: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/parking-lots/${parkingLotId}/slots`, { slotNumber }, { headers: this.getHeaders() });
  }

  // Availability Methods
  getAvailability(parkingLotId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/availability/${parkingLotId}`, { headers: this.getHeaders() });
  }

  initializeSlotAvailability(parkingLotId: number, slotId: number, slotNumber: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/availability`, { parkingLotId, slotId, slotNumber }, { headers: this.getHeaders() });
  }

  // Reservation Methods
  createReservation(userId: number, slotId: number, parkingLotId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/reservations`, { userId, slotId, parkingLotId }, { headers: this.getHeaders() });
  }

  getUserReservations(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/reservations/user/${userId}`, { headers: this.getHeaders() });
  }

  getLotReservations(lotId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/reservations/lot/${lotId}`, { headers: this.getHeaders() });
  }

  cancelReservation(reservationId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/reservations/${reservationId}/cancel`, {}, { headers: this.getHeaders() });
  }
}
