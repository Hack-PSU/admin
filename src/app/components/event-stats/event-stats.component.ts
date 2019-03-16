import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpAdminService } from '../../services/http-admin/http-admin.service';
import { ActivatedRoute } from '@angular/router';
import {
  MatDialog,
  MatPaginator,
  MatTableDataSource,
} from '@angular/material';
import { AlertService } from 'ngx-alerts';
import { IHackerRegistrationModel } from 'app/models/hacker-registration-model';
import { IEventStatisticsModel } from '../../models/event-statistic-model';
import { ViewEventAttendanceDialogComponent } from './view-event-attendance/view-event-attendance';

@Component({
  selector: 'app-event-stats',
  templateUrl: './event-stats.component.html',
  styleUrls: ['./event-stats.component.css'],
})
export class EventStatsComponent implements OnInit {

  private static tableCols = ['eventTitle', 'eventAttendance'];
  public displayedColumns = EventStatsComponent.tableCols;
  public dataSource = new MatTableDataSource<any>([]);
  private errors: Error = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public adminService: HttpAdminService,
    public activatedRoute: ActivatedRoute,
    public alertsService: AlertService,
    public dialog: MatDialog,
    ) { }
  /*
	* Error array used to display error messages
	*/

  ngOnInit() {
    this.activatedRoute.data.subscribe((user) => {
      if (user) {
        this.getEventData();
      } else {
        this.errors = new Error('Error: No user');
        console.error('No User');
      }
    },                                 (error) => {
      this.errors = new Error('Error: Issue with authentication of user');
      console.error(error);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getEventData() {
    this.adminService.getEventAttendance().subscribe((data: IEventStatisticsModel) => {
      let formattedData: IEventStatisticsModel[] = [];
      formattedData = Object.keys(data).map((key) => {
        return data[key];
      });

      this.displayedColumns = EventStatsComponent.tableCols;
      this.dataSource.data = formattedData;
    },                                               (error) => {
      console.error(error);
      this.alertsService.danger('Error: Issue with getting the event attendance');
    })
  }

  refreshData() {
    this.getEventData();
  }

  /**
   * Modify the data source to only have the filtered results
   *
   * Convert the filter value (string) to lowercase and remove any additional spacing. Then
   * set the filter property of the local datasource to the new filter value.
   *
   * @param: filterValue  String to filter the datasource
   */
  applyFilter(filterValue: string) {
    const mFilterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = mFilterValue;
  }


  viewAttendanceData(hacker: IHackerRegistrationModel) {
    const dialogRef = this.dialog.open(ViewEventAttendanceDialogComponent, {
      height: '600px',
      width: '750px',
      data: hacker,
      autoFocus: false,
    });
  }
}
