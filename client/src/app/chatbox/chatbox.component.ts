import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { SocketService } from '../socket.service';
@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {
  messages;
  message: { user: Object, body: String, map: String };
  chatbox;
  constructor(private _socket: SocketService, private _api: ApiService, private _route: ActivatedRoute) { }


  ngOnInit() {
    this.chatbox = document.getElementsByClassName('chat-box')[0];
    this.message = { user: {}, body: "", map: "" };

    const mapMessages$ = this._route.params.pipe(
      switchMap((params: Params) => {
        this.message.map = params.id;
        return this._api.getMapMessages(params.id);
      })
    );
    mapMessages$.subscribe(messages => {
      console.log(messages);
      this.messages = messages;
      //clunky, fix later
      setTimeout(() => {
        this.chatbox.scrollTop = this.chatbox.scrollHeight - this.chatbox.clientHeight;
      }, 1);
    });
    const messageUpdates$ = this._api.getUserWithToken().pipe(
      switchMap(user => {
        this.message.user = user;
        return this._socket.getMessageUpdates();
      })
    );
    messageUpdates$.subscribe(message => {
      this.messages.push(message);
      //clunky, fix later
      setTimeout(() => {
        this.chatbox.scrollTop = this.chatbox.scrollHeight - this.chatbox.clientHeight;
      }, 1);
    })
  }
  sendMessage() {
    this._api.sendMessage(this.message).subscribe();
    this.message.body = "";
  }

}
