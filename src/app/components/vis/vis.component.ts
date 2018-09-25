/**
 * TODO: Add docstring explaining component
 */
import { Component, OnInit } from '@angular/core';
import { HttpAdminService } from '../../services/http-admin/http-admin.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatSelectChange, MatGridListModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vis',
  templateUrl: './vis.component.html',
  styleUrls: ['./vis.component.css'],
})
// TODO: Add public/private labels for all properties
export class VisComponent implements OnInit {
  multi = [];
    // options
  showXAxis = true;
  timeline = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Registrations';
  single = [];

  tiles = [
        { case: 'ngx-charts-pie-chart', cols: 2, rows: 1, color: '#ffffff00' },
  ];


  colorScheme = {
    domain: ['#E5704C', '#6C88B7', '#133753', '#24577C', '#D0EAF1', '#C94331', '#AACACC', '#AACACC'],
  };
  autoScale = true;
  selected = 'referral';
  private user: firebase.User;

  private data: any[];

    /**
     *
     * @param data
     * @param key
     */
  static reduceParent(data, key: string) {
      /**
       * Reduction function for incoming data
       * @param accumulator
       * @param currentValue
       * @returns {any}
       */
    function reduceDataG(accumulator, currentValue) {
      const k = currentValue[key];
      if (k) {
        if (accumulator[k]) {
          accumulator[k].value += 1
        } else {
          accumulator[k] = {};
          accumulator[k].value = 1;
          accumulator[k].name = currentValue[key];
        }
      }
      return accumulator;
    }
    return data.reduce(reduceDataG, {});
  }

  static reduceData(accumulator, currentValue) {
    const date = new Date(currentValue.sign_up_time);
    const key = date.getDay().toString() + date.getMonth().toString() + date.getFullYear().toString();
    if (accumulator[key]) {
      accumulator[key].value += 1
    } else {
      accumulator[key] = {};
      accumulator[key].value = 1;
      accumulator[key].name = date;
    }
    return accumulator;
  }

  constructor(public adminService: HttpAdminService, public activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((user) => {
      if (user) {
        this.adminService.getRegistrations()
                    .subscribe((data: any[]) => {
                      this.data = data;
                      this.onOptionChange(null);
                    });
      }
    })
  }

  onOptionChange($event: MatSelectChange) {
    // TODO: Possbily migrate this giant chunk of code to a service
    switch (this.selected) {
      case 'referral':
        const mlh = this.data.filter(value => value.referral && value.referral.match(/mlh|major\sleague/i));

        const mlhObj = mlh.reduce(VisComponent.reduceData, {});


                // Facebook
        const fb = this.data.filter(value => value.referral && value.referral.match(/twitter|facebook|fb/i));
        const fbObj = fb.reduce(VisComponent.reduceData, {});

                // Friends
        const friend = this.data.filter(value => value.referral && value.referral.match(/friend/i));
        const friendObj = friend.reduce(VisComponent.reduceData, {});
                // school|professor|teacher|class|course|department|PSU|major
        const school = this.data.filter(value => value.referral && value.referral.match(/school|professor|advisor|teacher|class|course|department|PSU|major/i));
        const schoolObj = school.reduce(VisComponent.reduceData, {});
                // email
        const email = this.data.filter(value => value.referral && value.referral.match(/email/i));
        const emailObj = email.reduce(VisComponent.reduceData, {});
                // flyer|banner|poster
        const ads = this.data.filter(value => value.referral && value.referral.match(/flyer|banner|poster/i));
        const adsObj = ads.reduce(VisComponent.reduceData, {});
                // extra credit
        const excre = this.data.filter(value => value.referral && value.referral.match(/extra|cmpsc|compsc/i));
        const excreObj = excre.reduce(VisComponent.reduceData, {});

        this.multi = [
          {
            name: 'MLH',
            series: Object.keys(mlhObj).map(key => mlhObj[key]),
          },
          {
            name: 'FB',
            series: Object.keys(fbObj).map(key => fbObj[key]),
          },
          {
            name: 'FRIEND',
            series: Object.keys(friendObj).map(key => friendObj[key]),
          },
          {
            name: 'SCHOOL',
            series: Object.keys(schoolObj).map(key => schoolObj[key]),
          },
          {
            name: 'EMAIL',
            series: Object.keys(emailObj).map(key => emailObj[key]),
          },
          {
            name: 'ADVERTISE',
            series: Object.keys(adsObj).map(key => adsObj[key]),
          },
          {
            name: 'EXTRA CRE',
            series: Object.keys(excreObj).map(key => excreObj[key]),
          },
        ];

        const rData = VisComponent.reduceParent(this.data, 'referral');
        this.single = Object.keys(rData).map(key => rData[key]);
        break;

      case 'gender':
        // female
        const female = this.data.filter(value => value.gender && value.gender.match(/female/i));

        const femaleObj = female.reduce(VisComponent.reduceData, {});

        // male
        const male = this.data.filter(value => value.gender && value.gender.match(/male/i));
        const maleObj = male.reduce(VisComponent.reduceData, {});
        this.multi = [
          {
            name: 'FEMALE',
            series: Object.keys(femaleObj).map(key => femaleObj[key]),
          },
          {
            name: 'MALE',
            series: Object.keys(maleObj).map(key => maleObj[key]),
          },
        ];
        const gData = VisComponent.reduceParent(this.data, 'gender');
        this.single = Object.keys(gData).map(key => gData[key]);
        break;

      case 'experience':
        const beginner = this.data.filter(value => value.coding_experience && value.coding_experience.match(/beginner/i));
        const beginnerObj = beginner.reduce(VisComponent.reduceData, {});

        const intermediate = this.data.filter(value => value.coding_experience && value.coding_experience.match(/intermediate/i));
        const intermediateObj = intermediate.reduce(VisComponent.reduceData, {});

        const advanced = this.data.filter(value => value.coding_experience && value.coding_experience.match(/advanced/i));
        const advancedObj = advanced.reduce(VisComponent.reduceData, {});

        const none = this.data.filter(value => value.coding_experience && value.coding_experience.match(/none/i));
        const noneObj = none.reduce(VisComponent.reduceData, {});

        this.multi = [
          {
            name: 'BEGINNER',
            series: Object.keys(beginnerObj).map(key => beginnerObj[key]),
          },
          {
            name: 'INTERMED',
            series: Object.keys(intermediateObj).map(key => intermediateObj[key]),
          },
          {
            name: 'ADVANCED',
            series: Object.keys(advancedObj).map(key => advancedObj[key]),
          },
          {
            name: 'NONE',
            series: Object.keys(noneObj).map(key => noneObj[key]),
          },
        ];
        const cData = VisComponent.reduceParent(this.data, 'coding_experience');

        this.single = Object.keys(cData).map(key => cData[key]);
        break;

      case 'academic_year':
        const freshman = this.data.filter(value => value.academic_year && value.academic_year.match(/freshman/i));
        const freshmanObj = freshman.reduce(VisComponent.reduceData, {});

        const sophmore = this.data.filter(value => value.academic_year && value.academic_year.match(/sophmore/i));
        const sophmoreObj = sophmore.reduce(VisComponent.reduceData, {});

        const junior = this.data.filter(value => value.academic_year && value.academic_year.match(/junior/i));
        const juniorObj = junior.reduce(VisComponent.reduceData, {});

        const senior = this.data.filter(value => value.academic_year && value.academic_year.match(/senior/i));
        const seniorObj = senior.reduce(VisComponent.reduceData, {});

        const graduate = this.data.filter(value => value.academic_year && value.academic_year.match(/graduate/i));
        const graduateObj = graduate.reduce(VisComponent.reduceData, {});

        this.multi = [
          {
            name: 'FRESHMAN',
            series: Object.keys(freshmanObj).map(key => freshmanObj[key]),
          },
          {
            name: 'SOPHOMORE',
            series: Object.keys(sophmoreObj).map(key => sophmoreObj[key]),
          },
          {
            name: 'JUNIOR',
            series: Object.keys(juniorObj).map(key => juniorObj[key]),
          },
          {
            name: 'SENIOR',
            series: Object.keys(seniorObj).map(key => seniorObj[key]),
          },
          {
            name: 'GRADUATE',
            series: Object.keys(graduateObj).map(key => graduateObj[key]),
          },
        ];
        const aData = VisComponent.reduceParent(this.data, 'academic_year');

        this.single = Object.keys(aData).map(key => aData[key]);
        break;
    }
  }
}


