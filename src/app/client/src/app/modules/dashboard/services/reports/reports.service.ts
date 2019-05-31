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
      data: data
    };
    return this.publicDataService.post(options);
  }
  getUserDetails(userId) {
    const options = {
      url: this.configService.urlConFig.URLS.USER.READ + '/' + userId,
    };
    return this.publicDataService.get(options);
  }
}
