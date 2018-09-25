/*
 * Component shows a two column table of data for a single user. This is meant to be a pop-up
 * modal from the /userdata/ route when clicking on a person in the user data table on that
 * page.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-view-user-data-dialog',
  templateUrl: './view-user-data-dialog.html',
  styleUrls: ['./view-user-data-dialog.css'],
})
export class ViewUserDataDialogComponent implements OnInit {

  public user_data: any;
  public editToggleDisable = true;

  constructor(
    public dialogRef: MatDialogRef<ViewUserDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.user_data = data;
  }

  ngOnInit() {
    this.editToggleDisable = (
      this.user_data as any
    ).admin_edit_permission;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Simple function to convert a single character t-shirt size into a string
   *
   * @param: user_size  string representing the size of a t-shirt
   * @return: String representing the size of a t-shirt
   */
  getSizeText(user_size: string) {
    if (user_size != null) {
      switch (user_size) {
        case 'S':
          return 'Small';
        case 'M':
          return 'Medium';
        case 'L':
          return 'Large';
        case 'XL':
          return 'Extra Large';
        case 'XXL':
          return 'Double Extra Large';
        case 'XXXL':
          return 'Triple Extra Large';
      }
    } else {
      return 'N/A';
    }
  }

  /*
   * Captializes the first letter in a string
   */
  capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /*
   * Formats the string phone number into (XXX)-XXX-XXX
   */
  formatPhoneNumber(str: string) {
    if (str != null) {
      return '(' + str.slice(0, 3) + ')' + '-' + str.slice(3, 6) + '-' + str.slice(6);
    }
    return 'N/A';
  }

  /*
   * Converts the string number (1 or 0) to True or False respectively
   */
  numberToBoolean(str: string) {
    if (parseInt(str, 10) === 1) {
      return 'True';
    }
    return 'False';
  }
}
