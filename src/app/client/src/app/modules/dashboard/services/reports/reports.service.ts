import { Injectable } from '@angular/core';
import { PublicDataService } from '../../../core/services/public-data/public-data.service';
import { ConfigService } from '@sunbird/shared';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private publicDataService: PublicDataService, public configService: ConfigService) { }

  getContentCreationStaticsReport(data) {
    const options = {
      url: this.configService.urlConFig.URLS.CONTENT.SEARCH,
      data: data
    };
    return this.publicDataService.post(options);
  }
  getOrganizationName(data) {
    const options = {
      url: this.configService.urlConFig.URLS.ORGANIZATION.READ,
      data: data,
      header: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3MmJlMjQ4ODVkY2Y0ZjI4ODEwNDk4ZDBhY2ZhZGQxYiJ9.VV53QoQ1JLd_5fN7jJjV_vzRWL1J-zNJfJOw4XauWOg' }
    };
    return this.publicDataService.post(options);
  }
  getUserDetails(userId) {
    const options = {
      url: this.configService.urlConFig.URLS.USER.READ + '/' + userId,
    };
    return this.publicDataService.get(options);
  }
  getCityList(data) {
    const options = {
      url: this.configService.urlConFig.URLS.CHANNEL.LIST,
      data: data,
      header: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3MmJlMjQ4ODVkY2Y0ZjI4ODEwNDk4ZDBhY2ZhZGQxYiJ9.VV53QoQ1JLd_5fN7jJjV_vzRWL1J-zNJfJOw4XauWOg' }
    };
    return this.publicDataService.post(options);
  }
  getDepartmentList(frameWork: string) {
    const options = {
      url: this.configService.urlConFig.URLS.FRAMEWORK.READ + '/' + frameWork,
    };
    return this.publicDataService.get(options);
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
    return this.publicDataService.post(options);
  }
}