import { Resteable } from './interfaces/resteable';

export class EventModel implements Resteable{
  event_location: string;
  event_start_time: number;
  event_end_time: number;
  event_title: string;
  event_description: string;
  event_type: string;

  constructor() {
    this.event_location = '';
    this.event_start_time = 0;
    this.event_end_time = 0;
    this.event_title = '';
    this.event_description = '';
    this.event_type = '';
  }

  restRepr() {
    return {
      eventLocation: this.event_location,
      eventStartTime: new Date(this.event_start_time).getTime(),
      eventEndTime: new Date(this.event_end_time).getTime(),
      eventTitle: this.event_title,
      eventDescription: this.event_description,
      eventType: this.event_type,
    };
  }
}
