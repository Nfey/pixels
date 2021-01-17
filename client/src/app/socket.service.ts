import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  claimObserver: Observer<any>;
  messageObserver: Observer<any>;
  initialTurnObserver: Observer<any>;
  socket;
  constructor(private _router: Router) { }

  getClaimUpdates() {
    return this.createClaimObservable();
  }
  getMessageUpdates() {
    return this.createMessageObservable();
  }
  getInitialTurnUpdates(){
    return this.createInitialTurnObservable();
  }
  connect() {
    const accessToken = localStorage.getItem('access_token');
    this.socket = io('http://localhost:8000/', { query: "token=" + accessToken});
    this.socket.on('pixelClaimed', pixel => {
      return this.claimObserver.next(pixel);
    });
    this.socket.on('new-message', message => {
      return this.messageObserver.next(message);
    });
    this.socket.on('redirectToMap', map => {
      console.log('redirect');
      this._router.navigate(['/maps', map._id]);
    });
    this.socket.on('turn-is-over', map => {
      return this.initialTurnObserver.next(map);
    });
  }
  joinRoom(id) {
    this.socket.emit('join-room', id);
    // this.socket.on('joined', _=> {
    //   console.log('room joined');
    // });
  }
  leaveRoom() {
    this.socket.emit('leave-room');
  }
  sendMessage(message) {
    this.socket.emit('sending-message', message);
  }

  createClaimObservable() {
    return new Observable(observer => this.claimObserver = observer);
  }
  createMessageObservable() {
    return new Observable(observer => this.messageObserver = observer);
  }
  createInitialTurnObservable() {
    return new Observable(observer => this.initialTurnObserver = observer);
  }
}
