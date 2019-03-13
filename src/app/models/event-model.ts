import { Resteable } from './interfaces/resteable';

export class EventModel implements Resteable {

  uid: string;
  event_location: string;
  event_start_time: number;
  event_end_time: number;
  event_title: string;
  event_description: string;
  event_type: string;
  location_name: string;

  static parseJSON(val: any): EventModel {
    const e = new EventModel();
    e.event_location = val.event_location || '';
    e.event_title = val.event_title || '';
    e.event_start_time = val.event_start_time || 0;
    e.event_end_time = val.event_end_time || 0;
    e.event_description = val.event_description || '';
    e.event_type = val.event_type || '';
    e.location_name = val.location_name || '';
    e.uid = val.uid || '';
    return e;
  }
  constructor() {
    this.event_location = '';
    this.event_start_time = 0;
    this.event_end_time = 0;
    this.event_title = '';
    this.event_description = '';
    this.event_type = '';
    this.event_location = '';
    this.uid = '';
  }

  fromData(event: EventModel) {
    this.event_location = event.event_location;
    this.event_start_time = event.event_start_time;
    this.event_end_time = event.event_end_time;
    this.event_title = event.event_title;
    this.event_description = event.event_description;
    this.event_type = event.event_type;
    this.uid = event.uid;
  }

  restRepr() {
    return {
      eventLocation: this.event_location.toString(),
      eventStartTime: new Date(this.event_start_time).getTime(),
      eventEndTime: new Date(this.event_end_time).getTime(),
      eventTitle: this.event_title,
      eventDescription: this.event_description,
      eventType: this.event_type,
      uid: this.uid,
    };
  }

  equals(e: EventModel) {
    for (const i in e) {
      if (e.hasOwnProperty(i)) {
        if (e[i] !== this[i]) {
          return false;
        }
      }
    }
    return true;
  }
}
