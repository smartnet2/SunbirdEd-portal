import { Component, OnInit, OnChanges, ViewChild, ElementRef, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkSpace } from '../../classes/workspace';
import { SearchService, UserService } from '@sunbird/core';
import { ServerResponse, PaginationService, ConfigService, ToasterService, ResourceService, ILoaderMessage, INoResultMessage, ICard } from '@sunbird/shared';
import { WorkSpaceService } from '../../services';
import { IPagination } from '@sunbird/announcement';
import { SuiModalService } from 'ng2-semantic-ui';
import { IImpressionEventInput } from '@sunbird/telemetry';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
/**
 * The draft component search for all the drafts
*/
@Component({
    selector: 'app-h5p-content-upload',
    templateUrl: './h5p-upload.component.html'
})
export class H5PContentUploadComponent extends WorkSpace implements OnInit, OnChanges  {
    @ViewChild('h5pContentIframe') h5pContentIframe: ElementRef;
    /**
     * state for content editior
    */
    state: string;
    /**
     * To navigate to other pages
     */
    route: Router;
    /**
     * To send activatedRoute.snapshot to router navigation
     * service for redirection to draft  component
    */
    private activatedRoute: ActivatedRoute;
    /**
     * Contains unique contentIds id
    */
    contentIds: string;
    /**
     * Contains static data of popup like header label , submit button label etc
    */
    lockInfoPopupContent: object = { headerTitle: '' };
    /**
     * Contains list of published course(s) of logged-in user
    */
    draftList: Array<ICard> = [];
    /**
     * To show / hide loader
    */
    showLoader = true;
    /**
     * lock popup data for locked contents
    */
    lockPopupData: object;
    /**
     * loader message
    */
    loaderMessage: ILoaderMessage;
    /**
     * To show / hide no result message when no result found
    */
    noResult = false;
    /**
     * To show / hide error
    */
    showError = false;
    /**
     * To show content locked modal
    */
    showLockedContentModal = false;
    /**
     * no result  message
    */
    noResultMessage: INoResultMessage;
    /**
      * For showing pagination on draft list
    */
    private paginationService: PaginationService;
    /**
    * To get url, app configs
    */
    public config: ConfigService;
    /**
       * Contains page limit of inbox list
    */
    pageLimit: number;
    /**
      * Current page number of inbox list
    */
    pageNumber = 1;
    /**
      * totalCount of the list
    */
    totalCount: Number;
    /**
      * Contains returned object of the pagination service
    * which is needed to show the pagination on inbox view
      */
    pager: IPagination;
    /**
    * To show toaster(error, success etc) after any API calls
    */
    private toasterService: ToasterService;
    /**
    * To call resource service which helps to use language constant
   */
    public resourceService: ResourceService;
    /**
     * inviewLogs
    */
    inviewLogs = [];
    /**
     * telemetryImpression
    */
    telemetryImpression: IImpressionEventInput;
    /**
      * Constructor to create injected service(s) object
      Default method of Draft Component class
      * @param {SearchService} SearchService Reference of SearchService
      * @param {UserService} UserService Reference of UserService
      * @param {Router} route Reference of Router
      * @param {PaginationService} paginationService Reference of PaginationService
      * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
      * @param {ConfigService} config Reference of ConfigService
    */
    constructor(public sanitizer: DomSanitizer,public modalService: SuiModalService, public searchService: SearchService, public workSpaceService: WorkSpaceService, paginationService: PaginationService, activatedRoute: ActivatedRoute, route: Router, userService: UserService, toasterService: ToasterService, resourceService: ResourceService, config: ConfigService) {
        super(searchService, workSpaceService, userService);
        this.paginationService = paginationService;
        this.route = route;
        this.activatedRoute = activatedRoute;
        this.toasterService = toasterService;
        this.resourceService = resourceService;
        this.config = config;
        this.state = 'draft';
        this.loaderMessage = {
            'loaderMessage': this.resourceService.messages.stmsg.m0011,
        };
    }
    getSourceURL() {
        return this.sanitizer.bypassSecurityTrustResourceUrl('http://52.229.188.165:8080/edit');
    }
    ngOnInit() {
        this.showh5p();
    }
    ngOnChanges() {
        this.showh5p();
    }
    showh5p() {
        const iFrameSrc = "h5p/content/create";
        setTimeout(() => {
          this.h5pContentIframe.nativeElement.src = iFrameSrc;
          this.h5pContentIframe.nativeElement.onload = () => {
              this.adjustPlayerHeight();
          };
        }, 0);
    }
      /**
   * Adjust player height after load
   */
  adjustPlayerHeight () {
    const playerWidth = $('#h5pIframe').width();
    if (playerWidth) {
      const height = playerWidth * (9 / 16);
      $('#h5pIframe').css('height', height + 'px');
    }
  }
    /**
     * This method sets the make an api call to get all drafts with page No and offset
     */
    fetchDrafts(limit: number, pageNumber: number) {
        this.showLoader = true;
        this.pageNumber = pageNumber;
        this.pageLimit = limit;
        const searchParams = {
            filters: {
                status: ['Draft', 'FlagDraft'],
                createdBy: this.userService.userid,
                contentType: this.config.appConfig.WORKSPACE.contentType,
                mimeType: this.config.appConfig.WORKSPACE.mimeType,
            },
            limit: this.pageLimit,
            offset: (this.pageNumber - 1) * (this.pageLimit),
            sort_by: { lastUpdatedOn: this.config.appConfig.WORKSPACE.lastUpdatedOn }
        };
        this.searchContentWithLockStatus(searchParams).subscribe((data: ServerResponse) => {
            if (data.result.count && data.result.content && data.result.content.length > 0) {
                this.totalCount = data.result.count;
                this.pager = this.paginationService.getPager(data.result.count, this.pageNumber, this.pageLimit);
                const constantData = this.config.appConfig.WORKSPACE.Draft.constantData;
                const metaData = this.config.appConfig.WORKSPACE.Draft.metaData;
                const dynamicFields = this.config.appConfig.WORKSPACE.Draft.dynamicFields;
                this.draftList = this.workSpaceService.getDataForCard(data.result.content, constantData, dynamicFields, metaData);
                this.showLoader = false;
            }
            else {
                this.showError = false;
                this.noResult = true;
                this.showLoader = false;
                this.noResultMessage = {
                    'messageText': 'messages.stmsg.m0125'
                };
            }
        }, (err: ServerResponse) => {
            this.showLoader = false;
            this.noResult = false;
            this.showError = true;
            this.toasterService.error(this.resourceService.messages.fmsg.m0006);
        });
    }
    /**
   * This method helps to navigate to different pages.
   * If page number is less than 1 or page number is greater than total number
   * of pages is less which is not possible, then it returns.
     *
     * @param {number} page Variable to know which page has been clicked
     *
     * @example navigateToPage(1)
     */
    navigateToPage(page: number): undefined | void {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pageNumber = page;
        this.route.navigate(['workspace/content/draft', this.pageNumber]);
    }
    /**
    * get inview  Data
    */
    inview(event) {
        _.forEach(event.inview, (inview, key) => {
            const obj = _.find(this.inviewLogs, (o) => {
                return o.objid === inview.data.metaData.identifier;
            });
            if (obj === undefined) {
                this.inviewLogs.push({
                    objid: inview.data.metaData.identifier,
                    objtype: inview.data.metaData.contentType,
                    index: inview.id
                });
            }
        });
        this.telemetryImpression.edata.visits = this.inviewLogs;
        this.telemetryImpression.edata.subtype = 'pageexit';
        this.telemetryImpression = Object.assign({}, this.telemetryImpression);
    }
}
