import { IInteractEventEdata, IInteractEventObject, TelemetryInteractDirective } from '@sunbird/telemetry';
import { IImpressionEventInput } from './../../../telemetry/interfaces/telemetry';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UsageService, ReportService } from './../../services';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '@sunbird/core';
import { DatePipe } from '@angular/common';
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
  donutChartData: any = [];
  chartData: Array<object> = [];
  table: any;
  showTrainingstats: boolean = true;
  isTableDataLoaded = false;
  enrolledCourseData: any = [];
  currentReport: any;
  slug: string;
  cols: any = [];
  noResult: boolean;
  noResultMessage: INoResultMessage;
  private activatedRoute: ActivatedRoute;
  telemetryImpression: IImpressionEventInput;
  telemetryInteractEdata: IInteractEventEdata;
  telemetryInteractDownloadEdata: IInteractEventEdata;
  constructor(public configService: ConfigService, private usageService: UsageService, private sanitizer: DomSanitizer,
    public userService: UserService, private toasterService: ToasterService,
    public resourceService: ResourceService, activatedRoute: ActivatedRoute, private router: Router, private datePipe: DatePipe, public reportService: ReportService
  ) {
    this.activatedRoute = activatedRoute;
  }

  ngOnInit() {
    this.setTelemetryImpression();
    this.getEnrolledCourses();
    this.adminDashboard = this.configService.rolesConfig.headerDropdownRoles.adminDashboard;
  }
  getEnrolledCourses() {
    this.reportService.getEnrolledCourses().subscribe(response => {
      this.enrolledCourseData = [];
      if (_.get(response, 'responseCode') === 'OK') {
        if (response.result.courses.length > 0) {
          this.enrolledCourseData = response.result.courses;
          var self = this;
          _.map(this.enrolledCourseData, function (obj) {
            obj.batchName = obj.batch.name;
            obj.courseName = obj.courseName;
            obj.enrollmentType = obj.batch.enrollmentType;
            obj.startDate = self.datePipe.transform(obj.batch.startDate, 'dd-MMM-yyyy');
            obj.enrollmentDate = self.datePipe.transform(obj.enrolledDate, 'dd-MMM-yyyy');
            obj.endDate = self.datePipe.transform(obj.batch.endDate, 'dd-MMM-yyyy');
            obj.completedOn = self.datePipe.transform(obj.completedOn, 'dd-MMM-yyyy');
            obj.statusName = (obj.progress === 0) ? 'Not-Started' : ((obj.progress === obj.leafNodesCount || obj.progress > obj.leafNodesCount) ? 'Completed' : 'In-Progress');
            obj.statusName = (obj.statusName != 'Completed' && (new Date(obj.batch.endDate) < new Date())) ? 'Expired' : obj.statusName;
          });
          this.initializeColumns();
          this.initializeDonutChart();
        }
        this.showTrainingstats = true;
        if (_.isEmpty(this.enrolledCourseData)) {
          this.showTrainingstats = false;
        }
      } else {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
    }, (err) => {
      console.log(err);
      this.noResultMessage = {
        'messageText': 'messages.stmsg.m0131'
      };
    });
  }
  initializeColumns() {
    this.cols = [
      { field: 'batchName', header: 'Batch Name' },
      { field: 'courseName', header: 'Course Name' },
      { field: 'enrollmentType', header: 'Enrollment Type' },
      { field: 'startDate', header: 'Batch Start Date' },
      { field: 'enrollmentDate', header: 'Enrollment Date' },
      { field: 'endDate', header: 'Target End Date' },
      { field: 'completedOn', header: 'Completion Date' },
      { field: 'statusName', header: 'Status' }
    ]
  }
  initializeDonutChart() {
    let labelArray = [];
    let datasets = [];
    let self = this;
    _.map(_.uniqBy(this.enrolledCourseData, 'statusName'), function (obj) {
      labelArray.push(' ' + _.get(obj, 'statusName'));
      datasets.push(_.filter(self.enrolledCourseData, { statusName: _.get(obj, 'statusName') }).length);
    });
    this.donutChartData = {
      labels: labelArray,
      datasets: [
        {
          data: datasets,
          backgroundColor: ["#42a5f5", "#26a69a", "#8bc34a", "#43a047"],
          hoverBackgroundColor: ["#42a5f5", "#26a69a", "#8bc34a", "#43a047"]
        }]
    };
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