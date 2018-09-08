import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.html',
  styleUrls: ['./location-dialog.css'],
})
export class LocationDialogComponent {

  public actionName = '';
  private currentLocationName = '';

  constructor(
    public dialogRef: MatDialogRef<LocationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.actionName = data.action_name;
    this.currentLocationName = data.current_location_name;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
