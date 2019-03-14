/*
 * Component shows a two column table of data for a single user. This is meant to be a pop-up
 * modal from the /userdata/ route when clicking on a person in the user data table on that
 * page.
 */
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSlideToggleChange, MatSlideToggle, MatButton} from '@angular/material';
import { IHackerDataModel } from '../../../models/hacker-model';
import { FormControl } from '@angular/forms';
import { Observable, ObservableLike } from 'rxjs';
import { map, startWith, toArray } from 'rxjs/operators';
import { default as SchoolList } from '../../../../assets/schools.json';
import { default as MajorList } from '../../../../assets/majors.json';
import { default as ReferralList } from '../../../../assets/referral_sources.json';
import { IMatSelectionModel } from '../../../models/interfaces/mat-selection-interface'

@Component({
  selector: 'app-view-hacker-data-dialog',
  templateUrl: './view-hacker-data-dialog.html',
  styleUrls: ['./view-hacker-data-dialog.css'],
})
export class ViewHackerDataDialogComponent implements OnInit {

  private passed_data: any;
  private hacker_data: IHackerDataModel;
  private editToggleDisabled: boolean;
  private editToggleState: boolean;
  private hacker: IHackerDataModel;

  private genderOptions: IMatSelectionModel[];
  private academicYearOptions: IMatSelectionModel[];
  private shirtSizeOptions: IMatSelectionModel[];
  private dietaryRestrictionOptions: IMatSelectionModel[];
  private raceOptions: IMatSelectionModel[];
  private codingOptions: IMatSelectionModel[];

  private schools: string[];
  private schoolFormControl = new FormControl();
  private filteredSchoolOptions: Observable<string[]>;

  private majors: string[];
  private majorFormControl = new FormControl();
  private filteredMajorOptions: Observable<string[]>;

  private referrals: string[];
  private referralFormControl = new FormControl();
  private filteredReferralOptions: Observable<string[]>;

  private dietaryResSelection: string;
  private travelReimToggle: boolean;
  private firstHackToggle: boolean;
  private eighteenBeforeToggle: boolean;
  private mlhCocToggle: boolean;
  private mlhDcpToggle: boolean;
  private veteranToggle: boolean;

  constructor(
    public dialogRef: MatDialogRef<ViewHackerDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.passed_data = data;
    this.hacker_data = this.passed_data.hacker;
    this.hacker = Object.assign({}, this.hacker_data);
  }

  ngOnInit() {
    this.editToggleState = false;
    this.editToggleDisabled = !this.passed_data.editPermission;
    this.setupToggles();
    this.setupSelectionChoices();
    this.setupAutoCompleteFilters();
  }

  private setupSelectionChoices() {
    this.genderOptions = [
      { value: 'male', viewValue: 'Male' },
      { value: 'female', viewValue: 'Female' },
      { value: 'non-binary', viewValue: 'Non-Binary' },
      { value: 'no-disclose', viewValue: 'No-Disclose' },
    ];
    this.academicYearOptions = [
      { value: 'freshmen', viewValue: 'Freshmen' },
      { value: 'sophomore', viewValue: 'Sophomore' },
      { value: 'junior', viewValue: 'Junior' },
      { value: 'senior', viewValue: 'Senior' },
      { value: 'graduate', viewValue: 'Graduate' },
      { value: 'other', viewValue: 'Other' },
    ];
    this.shirtSizeOptions = [
      { value: 'XS', viewValue: 'Extra Small' },
      { value: 'S', viewValue: 'Small' },
      { value: 'M', viewValue: 'Medium' },
      { value: 'L', viewValue: 'Large' },
      { value: 'XL', viewValue: 'Extra Large' },
      { value: 'XXL', viewValue: 'Extra Extra Large' },
    ];
    this.dietaryRestrictionOptions = [
      { value: 'none', viewValue: 'None' },
      { value: 'vegetarian', viewValue: 'Vegetarian' },
      { value: 'vegan', viewValue: 'Vegan' },
      { value: 'kosher', viewValue: 'Kosher' },
      { value: 'halal', viewValue: 'Halal' },
      { value: 'gluten-free', viewValue: 'Gluten Free' },
      { value: 'other', viewValue: 'Other' },
    ];
    this.raceOptions = [
      { value: 'native-american', viewValue: 'Native American or Alaska Native' },
      { value: 'asian', viewValue: 'Asian' },
      { value: 'african-american', viewValue: 'Black or African American' },
      { value: 'latinx', viewValue: 'Hispanic or Latinx' },
      { value: 'pacific-islander', viewValue: 'Native Hawaiian or Other Pacific Islander' },
      { value: 'caucasian', viewValue: 'Caucasian' },
      { value: 'other', viewValue: 'Other' },
    ];
    this.codingOptions = [
      { value: 'none', viewValue: 'None' },
      { value: 'beginner', viewValue: 'Beginner' },
      { value: 'intermediate', viewValue: 'Intermediate' },
      { value: 'advanced', viewValue: 'Advanced' },
    ];
  }

  private setupAutoCompleteFilters() {
    this.schools = Object.keys(SchoolList);
    this.filteredSchoolOptions = this.schoolFormControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterHelper(value, 'schools')),
    );
    this.majors = Object.keys(MajorList);
    this.filteredMajorOptions = this.majorFormControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterHelper(value, 'majors')),
    );
    this.referrals = Object.keys(ReferralList);
    this.filteredReferralOptions = this.referralFormControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this.filterHelper(value, 'referrals')),
    );
  }

  private filterHelper(value: string, filter: string) {
    if (value) {
      const filterValue = value.toLowerCase();
      switch (filter) {
        case 'majors': return this.majors.filter(option => option.toLowerCase().includes(filterValue));
        case 'schools': return this.schools.filter(option => option.toLowerCase().includes(filterValue));
        case 'referrals': return this.referrals.filter(option => option.toLowerCase().includes(filterValue));
      }
    } else {
      switch (filter) {
        case 'majors': return this.majors;
        case 'schools': return this.schools;
        case 'referrals': return this.referrals;
      }
    }
  }

  private setupToggles() {
    this.travelReimToggle = this.hacker_data.travel_reimbursement ? true : false;
    this.firstHackToggle = this.hacker_data.first_hackathon ? true : false;
    this.eighteenBeforeToggle = this.hacker_data.eighteenBeforeEvent ? true : false;
    this.mlhCocToggle = this.hacker_data.mlh_coc ? true : false;
    this.mlhDcpToggle = this.hacker_data.mlh_coc ? true : false;
    this.veteranToggle = this.hacker_data.veteran === 'true' ? true : false;
  }

  onChange(ob: MatSlideToggleChange) {
    const matSlideToggle: MatSlideToggle = ob.source;
    switch (matSlideToggle.name) {
      case 'editToggle': this.editToggleState = matSlideToggle.checked; break;
      case 'travelReim': this.travelReimToggle = matSlideToggle.checked; break;
      case 'firstHack': this.firstHackToggle = matSlideToggle.checked; break;
      case 'eighteenBefore': this.eighteenBeforeToggle = matSlideToggle.checked; break;
      case 'mlhCoc': this.mlhCocToggle = matSlideToggle.checked; break;
      case 'mlcDcp': this.mlhDcpToggle = matSlideToggle.checked; break;
      case 'veteran': this.veteranToggle = matSlideToggle.checked; break;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmitButtonClick() {
    if (this.dietaryResSelection !== 'other') { this.hacker.dietary_restriction = this.dietaryResSelection; }
    if (this.dietaryResSelection === 'none') { this.hacker.dietary_restriction = 'none'; this.hacker_data.dietary_restriction = 'none'; }
    if (!this.dietaryResSelection) { this.hacker.dietary_restriction = null; }
    if (this.hacker.allergies === 'none' || this.hacker.allergies === 'None') {
      this.hacker.allergies = 'none';
      this.hacker_data.allergies = 'none';
    };
    const changedRegistration = {
      firstName: this.hacker.firstname || this.hacker_data.firstname,
      lastName: this.hacker.lastname || this.hacker_data.lastname,
      email: this.hacker.email || this.hacker_data.email,
      gender: this.hacker.gender || this.hacker_data.gender,
      university: this.schoolFormControl.value ? this.schoolFormControl.value : this.hacker_data.university,
      academicYear: this.hacker.academic_year || this.hacker_data.academic_year,
      major: this.majorFormControl.value ? this.majorFormControl.value : this.hacker_data.major,
      shirtSize: this.hacker.shirt_size || this.hacker_data.shirt_size,
      dietaryRestriction: this.hacker.dietary_restriction || this.hacker_data.dietary_restriction,
      allergies: this.hacker.allergies || this.hacker_data.allergies,
      travelReimbursement: this.travelReimToggle.toString() || this.hacker_data.travel_reimbursement.toString(),
      firstHackathon: this.firstHackToggle.toString() || this.hacker_data.first_hackathon.toString(),
      phone: this.hacker.phone || this.hacker_data.phone,
      ethnicity: this.hacker.race || this.hacker_data.race,
      codingExperience: this.hacker.coding_experience || this.hacker_data.coding_experience,
      eighteenBeforeEvent: this.eighteenBeforeToggle.toString() || this.hacker_data.eighteenBeforeEvent.toString(),
      mlhcoc: this.mlhCocToggle.toString() || this.hacker_data.mlh_coc.toString(),
      mlhdcp: this.mlhDcpToggle.toString() || this.hacker_data.mlh_dcp.toString(),
      referral: this.referralFormControl.value ? this.referralFormControl.value : this.hacker_data.referral,
      projectDesc: this.hacker.project || this.hacker_data.project,
      expectations: this.hacker.expectations || this.hacker_data.expectations,
      veteran: this.veteranToggle.toString() || this.hacker_data.veteran,
      uid: this.hacker.uid || this.hacker_data.uid,
      submitted: this.hacker.submitted || this.hacker_data.submitted,
      hackathon: this.hacker.hackathon || this.hacker_data.hackathon,
    }
    this.dialogRef.close(changedRegistration);
  }

  /**
   * Resets the edit form to clear any changes
   */
  onResetHackerDataClick() {
    this.hacker = Object.assign({}, this.hacker_data);
    this.schoolFormControl.reset();
    this.majorFormControl.reset();
    this.referralFormControl.reset();
    this.setupToggles();
  }

  /**
   * Simple function to convert a single character t-shirt size into a string
   *
   * @param: user_size  string representing the size of a t-shirt
   * @return: String representing the size of a t-shirt
   */
  getSizeText(user_size: string) {
    if (user_size) {
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
}
