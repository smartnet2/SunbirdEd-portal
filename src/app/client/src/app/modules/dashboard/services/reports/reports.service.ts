import { Injectable } from '@angular/core';
import { PublicDataService } from '../../../core/services/public-data/public-data.service';
import { ConfigService } from '@sunbird/shared';
import { LearnerService, UserService } from '@sunbird/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  /**
 * user id
 */
  userid: string;
  /**
 * To get details about user profile.
 */
  private userService: UserService;
  /**
 * reference of lerner service.
 */
  public learnerService: LearnerService;
  /**
  * constructor
  * @param {LearnerService} learner LearnerService reference
  * @param {UserService} userService Reference of UserService.
  */
  constructor(userService: UserService, private publicDataService: PublicDataService, learner: LearnerService, public configService: ConfigService) {
    this.learnerService = learner;
    this.userService = userService;
    this.userid = this.userService.userid;

  }

  getContentCreationStaticsReport(data) {
    const options = {
      url: this.configService.urlConFig.URLS.CONTENT.SEARCH,
      data: data
    };
    return this.publicDataService.post(options);
  }
  getOrganizationName(data) {
    const options = {
      url: this.configService.urlConFig.URLS.ADMIN.ORG_SEARCH,
      data: data,
    };
    return this.publicDataService.post(options);
  }
  getOrgList() {
    const options = {
      url: this.configService.urlConFig.URLS.CHANNEL.LIST,
    };
    return this.learnerService.post(options);
  }
  getDepartmentList(frameWork: string) {
    const options = {
      url: this.configService.urlConFig.URLS.FRAMEWORK.READ + '/' + frameWork,
    };
    return this.publicDataService.get(options);
  }
  getSubOrgList(data) {
    const option = {
      url: this.configService.urlConFig.URLS.ADMIN.ORG_SEARCH,
      data: data
    };
    return this.publicDataService.post(option);
  }
  getEnrolledCourses() {
    const option = {
      url: this.configService.urlConFig.URLS.COURSE.GET_ENROLLED_COURSES + '/' + this.userid,
      param: { ...this.configService.appConfig.Course.contentApiQueryParams, ...this.configService.urlConFig.params.enrolledCourses }
    };
    return this.learnerService.get(option);
  }
  getUserList() {
    const options = {
      url: this.configService.urlConFig.URLS.ADMIN.USER_SEARCH,
      data: {
        request: {
          filters: {},
          limit: 5000,
        }
      }
    };
    return this.learnerService.post(options);
  }
}