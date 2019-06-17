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
  selector: 'app-city-wise-report',
  templateUrl: './city-wise-report.component.html',
  styleUrls: ['./city-wise-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CityWiseReportComponent implements OnInit, OnDestroy {
  public unsubscribe = new Subject<void>();
  noResult: boolean = false;
  value: Date;
  currentDate: Date = new Date();
  fromDate: Date;
  toDate: Date;
  tableData: any = [];
  allOrgName: any = [];
  allUserName: any = [];
  cityList: any = [];
  selectedCity: string;
  cols: any[];
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
    this.getOrgDetails();
    this.getUserDetails();
  }
  getContentCreationStaticsReport() {
    const data = {
      "request": {
        "query": "",
        "filters": {
          "status": [
            "Live"
          ],
          "createdOn": { ">=": this.datePipe.transform(this.fromDate, 'yyyy-MM-ddTHH:MM'), "<=": this.datePipe.transform(this.toDate, 'yyyy-MM-ddTHH:MM') }
        },
        "limit": "1000",
        "sort_by": {
          "lastUpdatedOn": "desc"
        },
        "fields": ["identifier", "name", "contentType", "createdFor", "channel", "board", "medium", "gradeLevel", "subject", "lastUpdatedOn", "status", "createdBy", "framework", "createdOn"]
      }
    };
    this.reportService.getContentCreationStaticsReport(data).subscribe((response) => {
      if (_.get(response, 'responseCode') === 'OK') {
        if (response.result.content.length > 0) {
          this.tableData = [];
          let tempObj = _.cloneDeep(response.result.content);
          var self = this;
          _.map(tempObj, function (obj) {
            obj.createdOn = self.datePipe.transform(obj.createdOn, 'MM/dd/yyyy');
            if (!_.isEmpty(obj.channel)) {
              obj.OrgName = _.lowerCase(_.get(_.find(self.allOrgName, { 'id': obj.channel }), 'orgName'));
            } else {
              obj.OrgName = '';
            }
            if (!_.isEmpty(obj.createdBy)) {
              obj.UserName = _.get(_.find(self.allUserName, { 'id': obj.createdBy }), 'firstName') + " " + _.get(_.find(self.allUserName, { 'id': obj.createdBy }), 'lastName');
            } else {
              obj.UserName = '';
            }
          });
          if (!_.isEmpty(this.selectedCity)) {
            this.noResult = false;
            this.tableData = _.filter(tempObj, { OrgName: _.get(this.selectedCity, 'orgName') });
            this.initializeColumns();
            if (_.isEmpty(this.tableData)) {
              this.noResultMessage = {
                'messageText': 'messages.stmsg.m0131'
              };
              this.noResult = true;
            }
          }
        }
      } else {
        this.toasterService.error(this.resourceService.messages.emsg.m0007);
      }
    }, (err) => {
      console.log(err);
      this.toasterService.error(this.resourceService.messages.emsg.m0007);
    });
  }
  getOrgDetails() {
    this.allOrgName = [];
    const data = {
      "request": {
        "filters": {}
      }
    };
    this.reportService.getOrganizationName(data).subscribe((response) => {
      if (_.get(response, 'responseCode') === 'OK') {
        if (response.result.response.content.length > 0) {
          this.allOrgName = response.result.response.content;
          this.cityList = _.map(_.compact(_.reject(_.cloneDeep(response.result.response.content), function (obj) {
            if (_.lowerCase(obj.orgName) == 'nuis' || _.lowerCase(obj.orgName) == 'test nuis' || _.lowerCase(obj.orgName) == 'test niua' || obj.isRootOrg === false || _.isEmpty(obj.orgName))
              return obj;
          })), function (obj) {
            obj['orgName'] = _.lowerCase(obj['orgName']);
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
  getUserDetails() {
    this.allUserName = [];
    this.reportService.getUserList().subscribe((response) => {
      if (_.get(response, 'responseCode') === 'OK') {
        if (response.result.response.content.length > 0) {
          this.allUserName = response.result.response.content;
        }
      } else {
        this.toasterService.error(this.resourceService.messages.emsg.m0007);
      }
    }, (err) => {
      console.log(err);
      this.toasterService.error(this.resourceService.messages.emsg.m0007);
    });
  }
  initializeColumns() {
    this.cols = [
      // { field: 'OrgName', header: 'Organization Name' },
      { field: 'identifier', header: 'Identifier' },
      { field: 'subject', header: 'Subject' },
      { field: 'medium', header: 'Medium' },
      { field: 'createdOn', header: 'Created On' },
      { field: 'objectType', header: 'Object Type' },
      { field: 'gradeLevel', header: 'Grade Level' },
      { field: 'framework', header: 'Framework' },
      { field: 'UserName', header: 'Created By' },
      { field: 'name', header: 'Name' },
      { field: 'contentType', header: 'Content Type' },
      { field: 'board', header: 'Board' },
      { field: 'status', header: 'Status' }
    ]
  }
  resetFields() {
    this.fromDate = null;
    this.toDate = null;
    this.selectedCity = null;
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
