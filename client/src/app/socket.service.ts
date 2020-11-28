import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  claimObserver: Observer<any>;
  messageObserver: Observer<any>;
  socket;
  constructor() { }

  getClaimUpdates() {
    this.socket.on('pixelClaimed', pixel => {
      return this.claimObserver.next(pixel);
    });
    return this.createClaimObservable();
  }
  getMessageUpdates() {
    this.socket.on('new-message', message => {
      return this.messageObserver.next(message);
    });
    return this.createMessageObservable();
  }
  joinRoom(id) {
    this.socket = io('http://localhost:8000/');
    this.socket.emit('join-room', id);
    // this.socket.on('joined', _=> {
    //   console.log('room joined');
    // });
  }
  leaveRoom(){
    this.socket.emit('leave-room');
  }
  sendMessage(message){
    this.socket.emit('sending-message', message);
  }

  createClaimObservable() {
    return new Observable(observer => this.claimObserver = observer);
  }
  createMessageObservable() {
    return new Observable(observer => this.messageObserver = observer);
  }
}
