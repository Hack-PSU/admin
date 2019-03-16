import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { EventModel } from '../../../models/event-model';
import { HttpAdminService } from '../../../services/services';
import { LocationModel } from '../../../models/location-model';

@Component({
  selector: 'app-update-event-dialog',
  templateUrl: './update-event-dialog.html',
  styleUrls: ['./update-event-dialog.css'],
})
export class UpdateEventDialogComponent {

  public updatedEvent: EventModel;
  public locationList: Observable<LocationModel[]>;
  public eventStartTime: Date;
  public eventEndTime: Date;

  constructor(
    public dialogRef: MatDialogRef<UpdateEventDialogComponent>,
    private httpService: HttpAdminService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.locationList = this.httpService.getLocations().pipe(take(1));
    this.updatedEvent = new EventModel();
    this.updatedEvent.fromData(data);
    this.eventStartTime = new Date(this.updatedEvent.event_start_time);
    this.eventEndTime = new Date(this.updatedEvent.event_end_time);
  }

  public dateToNumber() {
    this.updatedEvent.event_start_time = new Date(this.eventStartTime).getTime();
    this.updatedEvent.event_end_time = new Date(this.eventEndTime).getTime();
  }
}
