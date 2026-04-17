import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  viewMode: 'overview' | 'manage' = 'overview';
  newLot = { name: '', address: '', latitude: null, longitude: null, ownerId: 1 };
  lots: any[] = [];
  globalLogMsg = '';
  logMsgs: {[key: number]: string} = {};
  lotDetails: any = {};

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    if(!localStorage.getItem('token') || localStorage.getItem('role') !== 'OWNER') {
      this.router.navigate(['/login']);
    } else {
      this.loadLots();
    }
  }

  loadLots() {
    this.api.getAllParkingLots().subscribe({
      next: (res) => {
        this.lots = res;
        for (let lot of this.lots) {
          this.loadLotAnalytics(lot.id);
        }
      },
      error: (e) => console.error(e)
    });
  }

  loadLotAnalytics(lotId: number) {
     this.lotDetails[lotId] = { total: 0, free: 0, reserved: 0, reservations: [] };
     
     this.api.getAvailability(lotId).subscribe(avail => {
         this.lotDetails[lotId].total = avail.length;
         this.lotDetails[lotId].free = avail.filter((s:any) => s.status === 'FREE').length;
         this.lotDetails[lotId].reserved = avail.filter((s:any) => s.status !== 'FREE').length;
     });

     this.api.getLotReservations(lotId).subscribe(resv => {
         let activeRes = resv.filter((r:any) => r.status === 'ACTIVE');
         this.lotDetails[lotId].reservations = activeRes;
         
         // Fetch usernames recursively to append UI tracking labels natively
         for(let res of activeRes) {
             this.api.getUserById(res.userId).subscribe(user => {
                 res.userName = user.username;
             });
         }
     });
  }

  addLot() {
    this.api.createParkingLot(this.newLot).subscribe({
      next: (res) => {
        this.globalLogMsg = 'Lot created successfully.';
        this.loadLots();
      },
      error: () => this.globalLogMsg = 'Failed to create lot.'
    });
  }

  addSlot(lotId: number, slotNum: string) {
    if (!slotNum) return;
    this.api.addSlot(lotId, slotNum).subscribe({
      next: (slot) => {
        this.api.initializeSlotAvailability(lotId, slot.id, slot.slotNumber).subscribe({
          next: () => this.logMsgs[lotId] = `Slot ${slotNum} added & set to FREE.`
        });
      }
    });
  }
}
