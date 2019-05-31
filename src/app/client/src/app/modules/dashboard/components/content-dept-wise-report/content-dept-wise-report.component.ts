import { IInteractEventEdata, IInteractEventObject, TelemetryInteractDirective } from '@sunbird/telemetry';
import { IImpressionEventInput } from '../../../telemetry/interfaces/telemetry';
import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { UsageService } from '../../services';
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
  selector: 'app-content-dept-wise-report',
  templateUrl: './content-dept-wise-report.component.html',
  styleUrls: ['./content-dept-wise-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContentDeptWiseReportComponent implements OnInit, OnDestroy {
  public unsubscribe = new Subject<void>();
  noResult: boolean = false;
  value: Date;
  currentDate: Date = new Date();
  fromDate: Date;
  toDate: Date;
  tableData: any = [];
  allOrgName: any = [];
  allUserName: any = [];
  contentTypeList: any = [
    { name: 'Resource' },
    { name: 'Course' },
    { name: 'Collection' }
  ];
  departmentList: any = [];
  selectedContentType: Object;
  selectedDepartment: Object;
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
    this.getDepartmentList();
  }
  getDepartmentList() {
    this.reportService.getDepartmentList('nulp').subscribe((response) => {
      if (_.get(response, 'responseCode') === 'OK') {
        if (response.result.framework.categories.length > 0) {
          if (!_.isEmpty(_.find(response.result.framework.categories, { code: 'board' }))) {
            this.departmentList = _.get(_.find(response.result.framework.categories, { code: 'board' }), 'terms');
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
          this.getOrgDetails(response.result.content);
        }
      } else {
        this.toasterService.error(this.resourceService.messages.emsg.m0007);
      }
    }, (err) => {
      console.log(err);
      this.toasterService.error(this.resourceService.messages.emsg.m0007);
    });
  }
  getOrgDetails(responseData) {
    this.allOrgName = [];
    var self = this;
    _.map(_.filter(_.uniqBy(responseData, 'channel'), 'channel'), function (obj) {
      self.reportService.getOrganizationName({ "request": { "organisationId": obj['channel'] } }).subscribe((response) => {
        if (_.get(response, 'responseCode') === 'OK') {
          if (response.result.response.channel != undefined) {
            self.allOrgName.push({ 'channel': obj['channel'], 'OrgName': response.result.response.channel });
            if (self.allOrgName.length === _.filter(_.uniqBy(responseData, 'channel'), 'channel').length) {
              self.updateValues(responseData, self.allOrgName, 'Org');
            }
          }
        } else {
          self.toasterService.error(self.resourceService.messages.emsg.m0007);
        }
      }, (err) => {
        console.log(err);
        self.toasterService.error(self.resourceService.messages.emsg.m0007);
      });
    });
  }
  getUserDetails(responseData) {
    this.allUserName = [];
    var self = this;
    _.map(_.filter(_.uniqBy(responseData, 'createdBy'), 'createdBy'), function (obj) {
      self.reportService.getUserDetails(obj['createdBy']).subscribe((response) => {
        if (_.get(response, 'responseCode') === 'OK') {
          // if (!_.isEmpty(response.result.response.firstName) && !_.isEmpty(response.result.response.lastName)) {
          self.allUserName.push({ 'createdBy': obj['createdBy'], 'UserName': response.result.response.firstName + ' ' + response.result.response.lastName });
          if (self.allUserName.length === _.filter(_.uniqBy(responseData, 'createdBy'), 'createdBy').length) {
            self.updateValues(responseData, self.allUserName, 'User');
          }
          // }
        } else {
          self.toasterService.error(self.resourceService.messages.emsg.m0007);
        }
      }, (err) => {
        console.log(err);
        self.toasterService.error(self.resourceService.messages.emsg.m0007);
      });
    });
  }
  builTableData(responseData) {
    this.tableData = [];
    let tempObj = _.cloneDeep(responseData);
    var self = this;
    _.map(tempObj, function (obj) {
      obj.createdOn = self.datePipe.transform(obj.createdOn, 'MM/dd/yyyy');
      if (!_.isEmpty(obj.channel)) {
        obj.OrgName = _.get(_.find(self.allOrgName, { 'channel': obj.channel }), 'OrgName');
      } else {
        obj.OrgName = '';
      }
      if (!_.isEmpty(obj.createdBy)) {
        obj.UserName = _.get(_.find(self.allUserName, { 'createdBy': obj.createdBy }), 'UserName');
      } else {
        obj.UserName = '';
      }
    });
    if (!_.isEmpty(this.selectedContentType) && !_.isEmpty(this.selectedDepartment)) {
      this.noResult = false;
      this.tableData = _.filter(_.filter(tempObj, { board: _.get(this.selectedDepartment, 'name') }), { contentType: _.get(this.selectedContentType, 'name') });
      this.initializeColumns();
      if (_.isEmpty(this.tableData)) {
        this.noResultMessage = {
          'messageText': 'messages.stmsg.m0131'
        };
        this.noResult = true;
      }
    }
  }
  updateValues(responseData, data, str) {
    if (str === 'Org') {
      this.allOrgName = data;
      this.getUserDetails(responseData);
    }
    if (str === 'User') {
      this.allUserName = data;
      this.builTableData(responseData);
    }
  }
  initializeColumns() {
    this.cols = [
      { field: 'OrgName', header: 'Organization Name' },
      { field: 'identifier', header: 'Identifier' },
      { field: 'subject', header: 'Subject' },
      { field: 'medium', header: 'Medium' },
      { field: 'createdOn', header: 'Created On' },
      { field: 'objectType', header: 'Object Type' },
      { field: 'gradeLevel', header: 'Grade Level' },
      { field: 'framework', header: 'Framework' },
      { field: 'UserName', header: 'Created By' },
      { field: 'name', header: 'Name' },
      // { field: 'contentType', header: 'Content Type' },
      // { field: 'board', header: 'Board' },
      { field: 'status', header: 'Status' }
    ]
  }
  resetFields() {
    this.fromDate = null;
    this.toDate = null;
    this.selectedContentType = null;
    this.selectedDepartment = null;
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}