
import {filter} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';

import { AppConstants } from '../../helpers/AppConstants';


@Injectable()
export class LiveUpdatesService {
  private url = `${AppConstants.SOCKET_BASE_URL}/updates`;
  // private socket;

  private broadcastSubject: BehaviorSubject<Event> = new BehaviorSubject<Event>(new Event(''));

  public next(event: Event): void {
    return this.broadcastSubject.next(event);
  }

  public subject(event: Event): Observable<Event> {
    return this.broadcastSubject.asObservable().pipe(filter(e => e.type === event.type));
  }


  constructor() {
  }

  getUpdates(idtoken: string) {
    return new Observable(null);
    // TODO: Change
    // return new Observable((observer) => {
    //   this.socket = io(this.url, {
    //     path: '/v1/live',
    //     transportOptions: {
    //       polling: { extraHeaders: { idtoken } },
    //     },
    //   });
    //   this.socket.on('connect', () => {
    //     console.log('CONNECTED');
    //     this.next(new Event('connected'));
    //   });
    //
    //   this.socket.on('disconnect', () => {
    //     console.log('DISCONNECTED');
    //     this.next(new Event('disconnected'));
    //   });
    //   this.socket.on('update', (data) => {
    //     observer.next(data);
    //   });
    //   this.socket.on('error', error => observer.error(error));
    //   return () => {
    //     this.socket.disconnect();
    //   };
    // });
  }

  sendMessage(message: string, title: string, push_notification: boolean) {
    return new Observable<{ uploaded, total }>(null);
    // this.socket.emit('upstream-update', { message, title, push_notification });
    // return new Observable<{ uploaded, total }>((observer) => {
    //   this.socket.on('upload-progress', (update: { uploaded, total }) => {
    //     observer.next(update);
    //   });
    //   this.socket.on('upload-error', error => observer.error(error));
    //   this.socket.on('upload-complete', () => observer.complete());
    // });
  }
}
