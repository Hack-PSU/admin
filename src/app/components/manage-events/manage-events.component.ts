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
import { AddEventDialogComponent } from './add-event-dialog';
import { HttpAdminService } from '../../services/services';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-manage-events',
  templateUrl: './manage-events.component.html',
  styleUrls: ['./manage-events.component.css'],
  providers: [
    MatSnackBar,
  ],
})
// TODO: Revamp this
export class ManageEventsComponent implements OnInit, AfterViewInit {

  static get regCols(): string[] {
    return this._regCols;
  }

  static set regCols(value: string[]) {
    this._regCols = value;
  }

  private static _regCols =
    [
      'location_name',
      // 'uid',
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) table: MatSort;

  constructor(
    private httpService: HttpAdminService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private _router: Router,
  ) {
    this.newEvent = new EventModel();
  }

  ngOnInit() {
    this.activatedRoute.data
        .subscribe((user) => {
          if (user) {
            this.httpService.getEvents().subscribe((events: EventModel[]) => {
              this.dataSource.data = this.dataSource.data.concat(events);
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

  addLocation() {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '400px',
      data: Object.keys(this.newEvent),
    });
    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result: EventModel) => {
          if (result) {
            result.event_start_time = new Date(result.event_start_time).getTime();
            result.event_end_time = new Date(result.event_end_time).getTime();
            return this.httpService.addEvent(result);
          }
          return of(new Error('Add a valid event'));
        }),
      )
      .subscribe(() => {
        this.snackBar.open('success', null, {
          duration: 2000,
        });
      },         (error) => {
        this.snackBar.open(error.body, null, {
          duration: 2000,
        });
      });
  }

  getTimeString(time: string) {
    return new Date(parseInt(time, 10)).toLocaleTimeString('nu', { day: 'numeric', month: 'short' });
  }

  applyFilter(value) {
    // TODO: Fill out.
  }
}

