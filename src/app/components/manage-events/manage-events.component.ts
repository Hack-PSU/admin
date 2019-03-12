/**
 * TODO: Add docstring explaining component
 */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { EventModel } from '../../models/event-model';
import {
  MatDialog,
  MatPaginator,
  MatSnackBar,
  MatSort,
  MatTableDataSource,
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConstants } from '../../helpers/AppConstants';
import { AddEventDialogComponent } from './add-event-dialog/add-event-dialog';
import { UpdateEventDialogComponent } from './update-event-dialog/update-event-dialog';
import { HttpAdminService } from '../../services/services';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AlertService } from 'ngx-alerts';
import { IApiResponseModel } from 'app/models/api-response-model';

@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.css'],
  providers: [
    MatSnackBar,
  ],
})

export class ManageEventsComponent implements OnInit, AfterViewInit {

  static get regCols(): string[] {
    return this._regCols;
  }

  static set regCols(value: string[]) {
    this._regCols = value;
  }

  private static _regCols =
    [
      'event_title',
      'location_name',
      'event_start_time',
      'event_end_time',
      'event_type',
      'event_uid',
      'action_button',
    ];

  public displayedColumns = ManageEventsComponent._regCols;
  public newEvent: EventModel;
  public dataSource = new MatTableDataSource<EventModel>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) table: MatSort;

  constructor(
    private httpService: HttpAdminService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private _router: Router,
    public alertsService: AlertService,
  ) {
    this.newEvent = new EventModel();
  }

  ngOnInit() {
    this.activatedRoute.data
        .subscribe((user) => {
          if (user) {
            this.httpService.getEvents().subscribe((events: EventModel[]) => {
              this.dataSource.data = events;
            });
          } else {
            this._router.navigate([AppConstants.LOGIN_ENDPOINT]);
          }
        });
  }

  /**
   * After the initilization of all angular components, set the variables
   *
   * After the component view has been initialized, set the local data source paginiator property
   * to the new instance of pagninator. Similar effect with sort.
   *
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.table;
  }

  refreshData() {
    this.httpService.getEvents().subscribe((events: EventModel[]) => {
      this.dataSource.data = this.dataSource.data = events;
    });
  }

  addEvent() {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '400px',
      data: Object.keys(this.newEvent),
    });
    dialogRef.afterClosed()
    .subscribe((event: EventModel) => {
      const e = new EventModel();
      if (event) {
        if (!event.equals(e)) {
          event.event_start_time = new Date(event.event_start_time).getTime();
          event.event_end_time = new Date(event.event_end_time).getTime();
          return this.httpService.addEvent(event).subscribe((res: IApiResponseModel<{}>) => {
            if (res.status === 200) {
              this.alertsService.success('Successfully added new event ' + event.event_title + '!');
              this.refreshData();
            }
          },                                                (error) => {
            console.log(error);
            this.alertsService.danger('Error: Failed to add a new event');
          });
        }
        this.alertsService.warning('Event not created! Please fill in all the fields.');
      }
    });
  }

  updateEvent(event: EventModel) {
    const dialogRef = this.dialog.open(UpdateEventDialogComponent, {
      width: '400px',
      data: event,
    });
    dialogRef.afterClosed()
    .subscribe((updatedEvent: EventModel) => {
      if (updatedEvent) {
        updatedEvent.event_start_time = new Date(updatedEvent.event_start_time).getTime();
        updatedEvent.event_end_time = new Date(updatedEvent.event_end_time).getTime();
        return this.httpService.updateEvent(updatedEvent).subscribe((res: IApiResponseModel<{}>) => {
          if (res.status === 200) {
            this.alertsService.success('Successfully updated event ' + updatedEvent.event_title + '!');
            this.refreshData();
          }
        },                                                          (error) => {
          console.log(error);
          this.alertsService.danger('Error: Failed to update event');
        });
      }
    });
  }

  getTimeString(time: string) {
    return new Date(parseInt(time, 10)).toLocaleTimeString('nu', { day: 'numeric', month: 'short' });
  }

  /**
   * Filters the location table to only include results containing the search string filterValue
   * 
   * @param filterValue Search string to filter by
   */
  applyFilter(filterValue: string) {
    let mFilterValue = filterValue.trim();
    mFilterValue = mFilterValue.toLowerCase();
    this.dataSource.filter = mFilterValue;
  }
}

