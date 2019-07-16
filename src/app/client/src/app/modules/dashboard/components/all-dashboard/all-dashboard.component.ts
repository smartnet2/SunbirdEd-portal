import { IInteractEventEdata, IInteractEventObject, TelemetryInteractDirective } from '@sunbird/telemetry';
import { IImpressionEventInput } from './../../../telemetry/interfaces/telemetry';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UsageService } from './../../services';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '@sunbird/core';
import { ToasterService, ResourceService, INoResultMessage, ConfigService } from '@sunbird/shared';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-all-dashboard',
  templateUrl: './all-dashboard.component.html',
  styleUrls: ['./all-dashboard.component.scss']
})
export class AllReportsComponent implements OnInit {
  /**
* Admin Dashboard access roles
*/
  adminDashboard: Array<string>;
  reportMetaData: any;
  chartData: Array<object> = [];
  table: any;
  isTableDataLoaded = false;
  currentReport: any;
  slug: string;
  noResult: boolean;
  noResultMessage: INoResultMessage;
  private activatedRoute: ActivatedRoute;
  telemetryImpression: IImpressionEventInput;
  telemetryInteractEdata: IInteractEventEdata;
  telemetryInteractDownloadEdata: IInteractEventEdata;
  constructor(public configService: ConfigService, private usageService: UsageService, private sanitizer: DomSanitizer,
    public userService: UserService, private toasterService: ToasterService,
    public resourceService: ResourceService, activatedRoute: ActivatedRoute, private router: Router
  ) {
    this.activatedRoute = activatedRoute;
  }

  ngOnInit() {
    this.setTelemetryImpression();
    this.adminDashboard = this.configService.rolesConfig.headerDropdownRoles.adminDashboard;
  }

  setTelemetryInteractObject(val) {
    return {
      id: val,
      type: 'view',
      ver: '1.0'
    };
  }

  setTelemetryImpression() {
    this.telemetryInteractEdata = {
      id: 'report-view',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };

    this.telemetryInteractDownloadEdata = {
      id: 'report-download',
      type: 'click',
      pageid: this.activatedRoute.snapshot.data.telemetry.pageid
    };

    this.telemetryImpression = {
      context: {
        env: this.activatedRoute.snapshot.data.telemetry.env
      },
      object: {
        id: this.userService.userid,
        type: 'user',
        ver: '1.0'
      },
      edata: {
        type: this.activatedRoute.snapshot.data.telemetry.type,
        pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
        uri: this.router.url
      }
    };
  }
}