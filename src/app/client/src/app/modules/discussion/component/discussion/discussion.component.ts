import { Component, OnInit } from '@angular/core';
import { CourseDiscussService } from '../../services/course-discuss/course-discuss.service';
import { DiscussionService } from '../../services/discussions/discussions.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { combineLatest, Subscription, Subject } from 'rxjs';
import { takeUntil, first, mergeMap, map } from 'rxjs/operators';
import { ResourceService } from './../../../shared/services/resource/resource.service';
import { ToasterService } from './../../../shared/services/toaster/toaster.service';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit {

  private activatedRouteSubscription: Subscription;
  // private activatedRoute: ActivatedRoute;

  private discussionService: DiscussionService;
  public batchId: string;
  public contentId: string;
  discussionThread: any = [];
  replyContent: any;
  repliesContent: any;
  threadId: any;


  public editor;
  public editorContent: any;
  public uploadedFile: any;
  public editorOptions = {
    placeholder: 'insert content...'
  };
  public telemetryInteractObject: IInteractEventObject;
  constructor(
    discussionService: DiscussionService, private activatedRoute: ActivatedRoute,
    public courseDiscussionsService: CourseDiscussService,
    private resourceService: ResourceService, public toasterService: ToasterService , public router: Router) {
    this.discussionService = discussionService;
  }

  ngOnInit() {
    const batchIdentifier: string = this.activatedRoute.snapshot.queryParamMap.get('batchIdentifier');
    this.activatedRoute.params.subscribe((params) => {
      this.contentId = params.contentId || params.collectionId;
    });

    this.activatedRoute.params.subscribe((params) => {
      this.batchId = params.batchId ? params.batchId : batchIdentifier;
      console.log('Inside discussion Player' + this.batchId);
      if (this.batchId) {
        this.courseDiscussionsService.retrieveDiscussion(this.batchId,'batch').subscribe((res: any) => {
          console.log('retirve', res, this.batchId);
          this.discussionThread = res.result.threads;
          this.threadId = this.discussionThread['0'] ? this.discussionThread['0'].id : '';
        });
      } else if (this.contentId) {
        this.courseDiscussionsService.retrieveDiscussion(this.contentId,'resource').subscribe((res: any) => {
          this.discussionThread = res.result.threads;
          this.threadId = this.discussionThread['0'] ? this.discussionThread['0'].id : '';
        });
      }
    });
  }
  postComment() {
    const discussTitle = this.batchId ? 'Discussion for batch' + '-' + this.batchId :
    'Discussion for resource' + '-' + this.contentId;
    const req = {
      'title': discussTitle,
      'body': 'Discussion for batch-content',
      'contextId': this.batchId || this.contentId,
      'contextType' : this.batchId ? 'batch' : 'resource'
    };
    this.courseDiscussionsService.postDiscussion(req).subscribe((res: any) => {
      if (this.batchId) {
      this.retreiveThread(this.batchId,'batch');
      } else {
        this.retreiveThread(this.contentId,'resource');
      }
      this.editorContent = '';
    },
    (err: any) => {
      console.log('the err response', err);
      if (err.status === '500') {
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
      } else {
        this.toasterService.error(err.error.params.errmsg);
      }
    });
  }
  startNewConversionClick() {
      this.postComment();
  }
  getReplies(id) {
    this.courseDiscussionsService.getReplies(id).subscribe((res: any) => {
      this.repliesContent = res.result.thread.replies;
      console.log('res', this.repliesContent);
    });
  }
  parseBody(body) {
    if (body.includes('</a>')) {
      return true;
    } else {
      return false;
    }
  }
  retreiveThread(id,tagType) {
    this.courseDiscussionsService.retrieveDiscussion(id,tagType).subscribe((res: any) => {
      this.discussionThread = res.result.threads;
      if (this.discussionThread.length !== 0) {
        this.threadId = this.discussionThread['0'].id;
        this.getReplies(this.threadId);
      }
    });
  }
  collapse(i, id) {
    this.discussionThread[i].show = !this.discussionThread[i].show;
    this.getReplies(id);
  }
  cancel(i) {
    this.discussionThread[i].replyEditor = !this.discussionThread[i].replyEditor;
  }
  postCancel() {
    this.editorContent = '';
  }
  reply(i) {
    this.discussionThread[i].replyEditor = !this.discussionThread[i].replyEditor;
  }
  replyToThread(id) {
    const body = {
      'body': this.uploadedFile ? this.uploadedFile + '  ' : '' + this.editorContent,
      'threadId': this.threadId
    };
    this.courseDiscussionsService.replyToThread(body).subscribe((res) => {
      this.editorContent = '';
      if (this.batchId) {
      this.retreiveThread(this.batchId,'batch');
      } else {
        this.retreiveThread(this.contentId,'resource');
      }
      this.getReplies(this.threadId);
    });
  }
  isDisabled() {
    if (this.editorContent && this.editorContent !== '' && this.editorContent.length >= 15) {
      return false;
    } else {
      return true;
    }
  }
  likePostClick(id, value) {
    let body = {};
    if (value) {
      body = {
        'request': {
          'postId': id.toString(),
          'value': 'up'
        }
      };
    } else {
      body = {
        'request': {
          'postId': id.toString(),
          'value': 'down'
        }
      };
    }
    this.courseDiscussionsService.likeReply(body).subscribe((res) => {
      this.editorContent = '';
      if (this.batchId) {
        this.retreiveThread(this.batchId,'batch');
      } else {
       this.retreiveThread(this.contentId,'resource');
      }
      this.getReplies(this.threadId);
    });
  }

  fileEvent(event) {
    const file = event.target.files[0];
    this.courseDiscussionsService.uploadFile(file).subscribe((res: any) => {
      if (res && res.result.response) {
        const url = res.result.response.url;
        const fileName = res.result.response.original_filename;
        this.uploadedFile = '<a class="attachment" href=' + url + '>' + fileName + '</a>';
        console.log('uploadedFile', this.uploadedFile);
      }
    });
    // this.challengeService.batchUpload(file).subscribe((result: any) => {
    //   if (this.utils.validatorMessage(result, KRONOS.MESSAGES.FILE_UPLOAD_SUCCESSFULLY)) {
    //     this.getAllUsersByOrg();
    //   }
    // });
  }
  postCommentInteractEdata () {
    return {
      id: 'comments',
      type: 'click',
      pageid: this.router.url.split('/')[1]
    };
  }
}
