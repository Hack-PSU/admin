/**
 * TODO: Add docstring explaining component
 */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { EmailListService } from '../../services/email-list/email-list.service';
import { htmlTemplate } from '../../../assets/email_template';
import { HttpAdminService } from '../../services/http-admin/http-admin.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { AddEmailDialogComponent } from './add-email-dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  providers: [],
  styleUrls: ['./send-email.component.css'],
})
export class SendEmailComponent implements OnInit {

  @ViewChild('iframe') iframe: ElementRef;

  secondFormGroup: FormGroup;
  keys = [];
  emailBody = '';
  emailSubject = '';
  customHTML = false;
  uploadedHTML = '';
  mDisabled = true;

  constructor(public emailListService: EmailListService, public dialog: MatDialog,
              public adminService: HttpAdminService, public activatedRoute: ActivatedRoute,
              private _formBuilder: FormBuilder,
  ) {

  }

  ngOnInit() {
    this.keys = Object.keys(this.emailListService.emailList[0] ?
                            this.emailListService.emailList[0] : { email: '' });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
      subjectCtrl: ['', Validators.required],
    });
  }

  deleteSelected(emailsDOMRef: any) {
    console.log(emailsDOMRef);
    const removalIndices = emailsDOMRef.selectedOptions.selected.map((location) => {
      return emailsDOMRef.options._results.findIndex(index => index === location);
    });
    this.emailListService.emailList = this.emailListService.emailList.filter((
      v,
      i,
    ) => removalIndices.indexOf(i) === -1);
  }

  addNew() {
    const dialogRef = this.dialog.open(AddEmailDialogComponent, {
      width: '300px',
      data: this.keys,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.emailListService.emailList.push(result);
      }
    });
  }

  addPlaceholder(id: any) {
    this.emailBody = this.emailBody.concat('$').concat(id).concat('$ ');
    if (id === 'forgot_url') {
      this.emailListService.emailList.forEach((object) => {
        object.forgot_url = 'https://app.hackpsu.org/forgot/?email='.concat(object.email);
      });
    }
  }

  emailConfirmClicked() {
    // Generate email sending request
    const generatedBody = this.generateEmailFromTemplate();
    this.adminService.sendEmail(
      generatedBody,
      this.emailSubject,
      this.emailListService.emailList.map((value) => {
        return {
          email: value.email,
          name: value.firstname ? value.firstname : '',
          substitutions: generatedBody.match(/\$\w+\$/g).reduce((substitution, arrValue) => {
            const key = arrValue.replace(/\$/g, '');
            substitution[key] = value[key].toString();
            return substitution;
          },                                                    {}),
        };
      }),
    ).subscribe((value) => {
      console.log(value);
    },          err => console.error(err));
  }

  generateEmailFromTemplate() {
    return this.customHTML ? this.uploadedHTML :
           htmlTemplate.replace(/\$\$BODY\$\$/g, this.emailBody.replace(/\n/g, '<br>'));
  }

  loadPreview() {
    const subHtml = this.generateEmailFromTemplate();
    if (document.getElementById('email-preview')) {
      const doc = this.iframe.nativeElement.contentDocument ||
                  this.iframe.nativeElement.contentWindow;
      doc.open();
      doc.write(subHtml);
      doc.close();
    }
  }

  htmlFileAdded($event) {
    console.log($event);
    const fileToLoad = $event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (fileLoadedEvent: any) => {
      this.uploadedHTML = fileLoadedEvent.target.result;
      this.mDisabled = false;
    };
    fileReader.readAsText(fileToLoad, 'UTF-8');
  }

  noop() {
    return;
  }
}

