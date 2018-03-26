import { Component, OnInit } from '@angular/core';
import { LiveUpdatesService } from '../live-updates.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

class UpdateModel {
  public idLIVE_UPDATES: string;
  public update_text: string;
  public update_image: string;
  public update_title: string;
}


@Component({
  selector: 'app-live-update',
  templateUrl: './live-update.component.html',
  providers: [LiveUpdatesService],
  styleUrls: ['./live-update.component.css'],
})
export class LiveUpdateComponent implements OnInit {

  updates: UpdateModel[];
  message: string;
  title: string;
  image: File;
  idtoken: Observable<string>;
  progress: { uploaded, total };
  error: any;
  loading = false;
  push_notification = false;

  constructor(public liveUpdates: LiveUpdatesService, public afAuth: AngularFireAuth) {
    this.updates = [];
    this.liveUpdates.subject(new Event('connected'))
      .subscribe((ev) => {
        this.updates = [];
        this.error = null;
        this.progress = null;
      });
    this.liveUpdates.subject(new Event('disconnected'))
      .subscribe((ev) => {
        this.updates = [];
        this.loading = true;
      });
    this.afAuth.auth.onAuthStateChanged((user) => {
      this.idtoken = Observable.fromPromise(user.getIdToken(true));
      this.idtoken.subscribe((value) => {
        this.liveUpdates.getUpdates(value).subscribe((message: UpdateModel[]) => {
          message.forEach(m => this.updates.push(m));
        });
      },                     (error) => {
        this.error = error;
      });
    });
  }

  sendMessage() {
    this.progress = null;
    this.error = null;
    this.loading = true;
    this.liveUpdates.sendMessage(this.message, this.image, this.title, this.push_notification)
      .subscribe((value) => {
        this.progress = value;
      },         (error) => {
        this.error = error;
        this.loading = false;
      },         () => {
        this.loading = false;
        this.message = '';
      });
  }

  ngOnInit() {
  }

  fileAdded($event) {
    this.image = $event.target.files[0];
  }
}
