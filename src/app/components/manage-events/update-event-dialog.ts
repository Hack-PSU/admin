import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { EventModel } from '../../models/event-model';
import { HttpAdminService } from '../../services/services';
import { LocationModel } from '../../models/location-model';

@Component({
  selector: 'app-update-event-dialog',
  templateUrl: './update-event-dialog.html',
  styleUrls: ['./update-event-dialog.css'],
})
export class UpdateEventDialogComponent {

  public outData: EventModel;
  public locationList: Observable<LocationModel[]>;

  constructor(
    public dialogRef: MatDialogRef<UpdateEventDialogComponent>,
    private httpService: HttpAdminService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (data.event_start_time) { data.event_start_time = new Date(parseInt(data.event_start_time, 10)); }
    if (data.event_end_time) { data.event_end_time = new Date(parseInt(data.event_end_time, 10)); }
    this.outData = data;
    this.locationList = this.httpService.getLocations()
                            .pipe(
                              take(1),
                            );
  }
}
