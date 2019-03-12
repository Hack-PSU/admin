import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { EventModel } from '../../../models/event-model';
import { HttpAdminService } from '../../../services/services';
import { LocationModel } from '../../../models/location-model';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './add-event-dialog.html',
  styleUrls: ['./add-event-dialog.css'],
})
export class AddEventDialogComponent {

  public createdEvent: EventModel;
  public locationList: Observable<LocationModel[]>;

  constructor(
    public dialogRef: MatDialogRef<AddEventDialogComponent>,
    private httpService: HttpAdminService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.createdEvent = new EventModel();
    this.locationList = this.httpService.getLocations().pipe(take(1));
  }
}
