import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';


@Injectable()
export class SocketService {
    private socket: SocketIOClient.Socket; // The client instance of socket.io
    private url = "http://localhost:5000"

    // Constructor with an injection of ToastService
    constructor(private router: Router) {
        this.socket = io(this.url);
    }

    // Emit: gist saved event
    sendMessage(msg) {
        console.log(msg)
        this.socket.emit('message', msg);
    }

    getMessages() {
        let observable = new Observable(observer => {
          this.socket = io(this.url);
          this.socket.on('message', (data) => {
            observer.next(data);  
              
          });
          return () => {
            this.socket.disconnect();
          };  
        })     
        return observable;
      }  
}
