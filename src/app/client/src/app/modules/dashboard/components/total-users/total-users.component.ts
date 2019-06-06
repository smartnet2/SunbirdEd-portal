import { IInteractEventEdata, IInteractEventObject, TelemetryInteractDirective } from '@sunbird/telemetry';
import { IImpressionEventInput } from './../../../telemetry/interfaces/telemetry';
import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { UsageService } from './../../services';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '@sunbird/core';
import { ToasterService, ResourceService, INoResultMessage, ConfigService } from '@sunbird/shared';
import { UUID } from 'angular2-uuid';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../../services/reports/reports.service';
import { DatePipe } from '@angular/common';
import { OnDelete } from 'fine-uploader/lib/core';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-total-users',
  templateUrl: './total-users.component.html',
  styleUrls: ['./total-users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TotalUserComponent implements OnInit, OnDestroy {
  public unsubscribe = new Subject<void>();
  noResult: boolean = false;
  cityList: any = [];
  selectedCity: object;
  totalUsers: number;
  noResultMessage: INoResultMessage;
  private activatedRoute: ActivatedRoute;
  telemetryImpression: IImpressionEventInput;
  constructor(private usageService: UsageService, private sanitizer: DomSanitizer, private configService: ConfigService,
    public userService: UserService, private toasterService: ToasterService,
    public resourceService: ResourceService, activatedRoute: ActivatedRoute, private router: Router, public reportService: ReportService, private datePipe: DatePipe
  ) {
    this.activatedRoute = activatedRoute;
  }
  ngOnInit() {
    this.reportService.getCityList({ "request": { "channel": {} } }).subscribe((response) => {
      if (_.get(response, 'responseCode') === 'OK') {
        if (response.result.channels.length > 0) {
          this.cityList = _.reject(response.result.channels, function (obj) {
            if (obj.name == 'nuis' || obj.name == 'nuis_test' || obj.name == 'niua_test')
              return obj;
          });
        }
      } else {
        this.toasterService.error(this.resourceService.messages.emsg.m0007);
      }
    }, (err) => {
      console.log(err);
      this.toasterService.error(this.resourceService.messages.emsg.m0007);
    });
  }
  getTotalUsers() {
    if (!_.isEmpty(this.selectedCity)) {
      this.reportService.getUserList().subscribe((response) => {
        this.totalUsers = null;
        if (_.get(response, 'responseCode') === 'OK') {
          if (response.result.response.content.length > 0) {
            var self = this;
            this.totalUsers = _.filter(response.result.response.content, { channel: _.get(self.selectedCity, 'name') }).length;
          }
        } else {
          this.toasterService.error(this.resourceService.messages.emsg.m0007);
        }
      }, (err) => {
        console.log(err);
        this.toasterService.error(this.resourceService.messages.emsg.m0007);
      });
    }
  }
  resetFields() {
    this.selectedCity = null;
    this.totalUsers = null;
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}