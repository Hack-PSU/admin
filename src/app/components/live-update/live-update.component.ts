/**
 * TODO: Add docstring explaning component
 */
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'ngx-alerts';
import { LiveUpdatesService } from '../../services/live-updates/live-updates.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { UpdateModel } from '../../models/update-model';
import { HttpAdminService } from '../../services/services';

@Component({
  selector: 'app-live-update',
  templateUrl: './live-update.component.html',
  providers: [LiveUpdatesService],
  styleUrls: ['./live-update.component.css'],
})
// TODO: Revamp to match new update model
export class LiveUpdateComponent implements OnInit {

  update: UpdateModel[];
  message: string;
  title: string;
  push_notification = false;

  constructor(public httpService: HttpAdminService, private alersService: AlertService) {
    this.message = '';
    this.title = '';
  }

  sendMessage() {
    this.httpService.sendLiveUpdate(this.message, this.title, this.push_notification)
      .subscribe(() => {
        this.message = '';
        this.title = '';
        this.push_notification = false;
        this.alersService.success('Live update sent!');
      })
  }

  ngOnInit() {
  }

  showError(error: any) {
    this.alersService.danger(error.toString());
  }
}
