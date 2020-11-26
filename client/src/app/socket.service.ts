import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  observer: Observer<any>;
  constructor() { }

  getClaimUpdates() {
    const socket = io('http://localhost:8000/');
    socket.on('pixelClaimed', pixel => {
      return this.observer.next(pixel);
    });
    return this.createObservable();
  }

  createObservable() {
    return new Observable(observer => this.observer = observer);
  }
}
