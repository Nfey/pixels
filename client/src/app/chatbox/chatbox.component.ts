import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { SocketService } from '../socket.service'; 
@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {
  messages;
  message: { user: Object, body: String };
  chatbox;
  constructor(private _socket: SocketService, private _api: ApiService) { }


  ngOnInit() {
    this.chatbox = document.getElementsByClassName('chat-box')[0];
    this.message = { user: {}, body: "" };
    this._api.getMessages().subscribe(messages => {
      this.messages = messages;
      //clunky, fix later
      setTimeout(() => {
        this.chatbox.scrollTop = this.chatbox.scrollHeight - this.chatbox.clientHeight;
      }, 1);
    });
    this._api.getUserWithToken().subscribe(user => {
      this.message.user = user;
      this._socket.getMessageUpdates().subscribe(message => {
        this.messages.push(message);
        //clunky, fix later
        setTimeout(() => {
          this.chatbox.scrollTop = this.chatbox.scrollHeight - this.chatbox.clientHeight;
        }, 1);
      });
    });
  }
  sendMessage(){
    this._api.sendMessage(this.message).subscribe();
    this.message.body = "";
  }

}
