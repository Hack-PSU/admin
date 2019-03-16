/**
 * TODO: Add docstring explaning component
 */
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'ngx-alerts';
import { LiveUpdatesService } from '../../services/live-updates/live-updates.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { UpdateModel } from '../../models/update-model';
import { HttpAdminService } from '../../services/services';
import { IApiResponseModel } from 'app/models/api-response-model';

@Component({
  selector: 'app-live-update',
  templateUrl: './live-update.component.html',
  providers: [LiveUpdatesService],
  styleUrls: ['./live-update.component.css'],
})

export class LiveUpdateComponent implements OnInit {

  public message: string;
  public title: string;
  public push_notification = false;

  constructor(public httpService: HttpAdminService, private alertsService: AlertService) {
    this.message = '';
    this.title = '';
  }

  sendMessage() {
    const liveUpdate = new UpdateModel(this.message, this.title, null, this.push_notification);
    this.httpService.sendLiveUpdate(liveUpdate)
      .subscribe((resp: IApiResponseModel<{}>) => {
        if (resp.status === 200) {
          this.message = '';
          this.title = '';
          this.push_notification = false;
          this.alertsService.success('Live update sent!');
        }
      },         (error) => {
        console.error(error);
        this.alertsService.danger('Error: Issue with sending live update.');
      });
  }

  ngOnInit() {
  }

  showError(error: any) {
    this.alertsService.danger(error.toString());
  }
}
