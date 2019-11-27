import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkSpace } from '../../classes/workspace';
import { SearchService, UserService } from '@sunbird/core';
import { ConfigService, ToasterService, ResourceService } from '@sunbird/shared';
import { WorkSpaceService } from '../../services';
import { SuiModalService } from 'ng2-semantic-ui';
import * as _ from 'lodash';
@Component({
    selector: 'app-h5p-content-upload',
    templateUrl: './h5p-upload.component.html'
})
export class H5PContentUploadComponent extends WorkSpace implements OnInit {
    @ViewChild('h5pContentIframe') h5pContentIframe: ElementRef;
    /**
     * To navigate to other pages
     */
    route: Router;
    /**
     * To send activatedRoute.snapshot to router navigation
     * service for redirection to h5p component
    */
    activatedRoute: ActivatedRoute;
    /**
    * To get url, app configs
    */
    public config: ConfigService;
    /**
      * Constructor to create injected service(s) object
      Default method of H5P Component class
      * @param {SearchService} SearchService Reference of SearchService
      * @param {UserService} UserService Reference of UserService
      * @param {Router} route Reference of Router
      * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
      * @param {ConfigService} config Reference of ConfigService
    */
    constructor(public modalService: SuiModalService, public searchService: SearchService, public workSpaceService: WorkSpaceService, activatedRoute: ActivatedRoute, route: Router, userService: UserService, toasterService: ToasterService, resourceService: ResourceService, config: ConfigService) {
        super(searchService, workSpaceService, userService);
        this.route = route;
        this.activatedRoute = activatedRoute;
        this.config = config;
    }
    ngOnInit() {
        this.showh5p();
    }
    showh5p() {
        const iFrameSrc = "h5p-editor";
        setTimeout(() => {
            this.h5pContentIframe.nativeElement.src = iFrameSrc;
            this.h5pContentIframe.nativeElement.onload = () => {
                this.adjustFrameHeight();
            };
        }, 0);
    }
    /**
    * Adjust iFrame height after load
    */
    adjustFrameHeight() {
        const playerWidth = $('#h5pContentIframe').width();
        if (playerWidth) {
            const height = playerWidth * (9 / 16);
            $('#h5pContentIframe').css('height', height + 'px');
        }
    }
}