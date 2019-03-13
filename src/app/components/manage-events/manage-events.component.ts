/**
 * Component handle the management of events Users have the ability to view all current
 * events and edit them with Create/Read/Update (CRU) functionality.
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
import { AddEventDialogComponent } from './add-event-dialog/add-event-dialog';
import { UpdateEventDialogComponent } from './update-event-dialog/update-event-dialog';
import { HttpAdminService } from '../../services/services';
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

  /**
   * Error array used to display error messages
   */
  public errors: Error = null;

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

  /**
   * On the initilization of all angular components, execute the functions
   *
   * Retrieves the events list and populates the events table using the http-admin service
   *
   * @exception: Failure on the auth service will cause an error to be displayed on the /userdata/ route page
   * @exception: Issue with the user not existing in the auth service database will cause an error to be displayed
   *              on the /userdata/ route page
   */
  ngOnInit() {
    this.activatedRoute.data
        .subscribe((user) => {
          if (user) {
            this.getEvents();
          } else {
            this.errors = new Error('Error: No user');
            console.error('No User');
          }
        },         (error) => {
          this.errors = new Error('Error: Issue with authentication of user');
          console.error(error);
        });
  }
  /**
   * Calls the HTTP service to get the events in order to populate the table
   *
   * @exception: Failure with the admin service will cause an error alert to be displayed on the /events/ route page
   */
  getEvents() {
    this.httpService.getEvents().subscribe((events: EventModel[]) => {
      this.dataSource.data = events;
    },                                     (error) => {
      console.error(error);
      this.alertsService.danger('Error, Failed to retrieve the events');
    });
  }

  /**
   * After the initilization of all angular components, set the variables
   *
   * After the component view has been initialized, set the local data source paginiator property
   * to the new instance of pagninator. Similar effect with sort.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.table;
  }

  /**
   * Abstraction method for refreshing the datatable and pulling the events data from the API
   */
  refreshData() {
    this.getEvents();
  }

   /**
   * Renders/Opens the add/insert event dialog
   *
   * Opens a dialog for creating a new event. After the dialog is closed, if data is passed and not null,
   * an event object will be passed to the HTTP Service to insert a new event.
   *
   * @exception: Failure with the admin service will cause an error to be displayed on the /events/ route page
   */
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

  /**
   * Renders/Opens the update event dialog
   *
   * Opens a dialog for updating an event. After the dialog is closed, if data is passed and not null,
   * an event object will be passed to the HTTP Service to update the event.
   *
   * @exception: Failure with the admin service will cause an error to be displayed on the /events/ route page
   */
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
  /**
   * Parses the unix timestring and formats it into a readable string
   *
   * @param time string unix timestring
   */
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

