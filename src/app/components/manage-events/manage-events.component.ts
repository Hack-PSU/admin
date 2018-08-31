/**
 * TODO: Add docstring explaining component
 */
import { Component, OnInit } from '@angular/core';
import { EventModel } from '../../models/event-model';
import { EventsService } from '../../services/events/events.service';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import * as uuid from 'uuid/v4';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConstants } from '../../helpers/AppConstants';
import { AddEventDialogComponent } from './add-event-dialog';

@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.css'],
  providers: [
    EventsService,
    MatSnackBar,
  ],
})
// TODO: Revamp this
export class ManageEventsComponent implements OnInit {

  static get regCols(): string[] {
    return this._regCols;
  }

  static set regCols(value: string[]) {
    this._regCols = value;
  }

  private static _regCols =
    [
      'location_name',
      'uid',
      'event_start_time',
      'event_end_time',
      'event_title',
      'event_description',
      'event_type',
      'button',
    ];

  public displayedColumns = ManageEventsComponent._regCols;
  public newEvent: EventModel;
  public dataSource = new MatTableDataSource<EventModel>([]);

  constructor(
    private eventsService: EventsService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private _router: Router,
  ) {
    this.newEvent = new EventModel();
  }

  ngOnInit() {
    this.eventsService.subject(new Event('connected'))
        .subscribe(() => {
          this.dataSource.data = [];
        });
    this.eventsService.subject(new Event('disconnected'))
        .subscribe(() => {
          this.dataSource.data = [];
        });
    this.activatedRoute.data
        .subscribe((user) => {
          if (user) {
            this.eventsService.getEvents('').subscribe((events: EventModel[]) => {
              this.dataSource.data = this.dataSource.data.concat(events);
            });
          } else {
            this._router.navigate([AppConstants.LOGIN_ENDPOINT]);
          }
        });
  }

  refreshData() {
    this.eventsService.getEvents('').subscribe((events: EventModel[]) => {
      this.dataSource.data = this.dataSource.data.concat(events);
    });
  }

  addLocation() {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '350px',
      data: Object.keys(this.newEvent),
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        result.uid = uuid();
        result.event_start_time = new Date(result.event_start_time).getTime().toString();
        result.event_end_time = new Date(result.event_end_time).getTime().toString();
        this.eventsService.addEvent(result)
            .subscribe((value) => {
              this.snackBar.open('success', null, {
                duration: 2000,
              });
            },         (error) => {
              this.snackBar.open(error.body, null, {
                duration: 2000,
              });
            });
      }
    });
  }

  getTimeString(time: string) {
    return new Date(parseInt(time, 10)).toLocaleTimeString();
  }
}

