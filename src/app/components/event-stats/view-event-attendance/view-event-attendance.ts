import { AfterViewInit, Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource, MatPaginator } from '@angular/material';
import { IHackerRegistrationModel } from 'app/models/hacker-registration-model';

@Component({
  selector: 'app-view-event-attendance-dialog',
  templateUrl: './view-event-attendance.html',
  styleUrls: ['./view-event-attendance.css'],
})
export class ViewEventAttendanceDialogComponent {

  private static tableCols = ['hackerFirstName', 'hackerLastName', 'hackerEmail'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  private attendeeData: IHackerRegistrationModel[];
  public displayedColumns = ViewEventAttendanceDialogComponent.tableCols;
  public dataSource = new MatTableDataSource<any>([]);


  constructor(public dialogRef: MatDialogRef<ViewEventAttendanceDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.attendeeData = data;
    this.displayedColumns = ViewEventAttendanceDialogComponent.tableCols;
    this.dataSource.data = this.attendeeData;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
