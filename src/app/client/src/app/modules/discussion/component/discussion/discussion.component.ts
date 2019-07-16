import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, OnChanges, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { CourseDiscussService } from '../../services/course-discuss/course-discuss.service';
import { DiscussionService } from '../../services/discussions/discussions.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { combineLatest, Subscription, Subject } from 'rxjs';
import { takeUntil, first, mergeMap, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { TreeViewService } from '../../shared/tree-view.service';
import { ResourceService } from './../../../shared/services/resource/resource.service';
import { ToasterService } from './../../../shared/services/toaster/toaster.service';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss'],
})
export class DiscussionComponent implements OnInit, OnChanges {
  // #NUIH change:
  // @ViewChild('fileInput') fileInput: ElementRef;
  // @ViewChild('fileInputforModal') fileInputforModal: ElementRef;
  selectedFile: string = null;
  public nestedComments: any = [];
  public postBtnText = 'Post';
  // public options: Object = {
  //   placeholderText: 'Type here...',
  //   charCounterCount: true,
  //   heightMin: 200,
  //   quickInsertTags: null,
  //   toolbarButtons: ['bold', 'italic', 'underline', 'formatOL', 'formatUL', 'insertLink', 'undo', 'redo', 'alert'],
  //   toolbarButtonsXS: ['bold', 'italic', 'underline', 'formatOL', 'formatUL', 'insertLink', 'undo', 'redo', 'alert'],
  //   toolbarButtonsSM: ['bold', 'italic', 'underline', 'formatOL', 'formatUL', 'insertLink', 'undo', 'redo', 'alert'],
  //   toolbarButtonsMD: ['bold', 'italic', 'underline', 'formatOL', 'formatUL', 'insertLink', 'undo', 'redo', 'alert']
  // };
  // #NUIH change:
  private activatedRouteSubscription: Subscription;
  // private activatedRoute: ActivatedRoute;

  private discussionService: DiscussionService;
  public batchId: string;
  public replyPostNumber: number = null;
  public contentId: string;
  discussionThread: any = [];
  replyContent: any;
  repliesContent: any = [];
  threadId: any;


  public editor;
  public editorContent: any = '';
  public editorContentForModal: any = '';
  public uploadedFile: any;
  public toolbarOptions = [
    ['bold', 'italic'],
    [{ 'list': 'bullet' }],
    ['link']
  ];
  public editorOptions = {
    placeholder: 'Type here...',
    modules: {
      toolbar: this.toolbarOptions
    }
  };
  public telemetryInteractObject: IInteractEventObject;
  totalCommentsCount: number = 0;
  showUploadLoader: boolean = false;
  showReplyLoader: boolean = false;
  showReplyLoaderforModal: boolean = false;
  constructor(
    discussionService: DiscussionService, public treeViewService: TreeViewService, private activatedRoute: ActivatedRoute,
    public courseDiscussionsService: CourseDiscussService, public resourceService: ResourceService,
    public toasterService: ToasterService, public router: Router) {
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
        this.courseDiscussionsService.retrieveDiscussion(this.batchId, 'batch').subscribe((res: any) => {
          console.log('retirve', res, this.batchId);
          this.discussionThread = res.result.threads;
          this.threadId = this.discussionThread['0'].id;
          this.getReplies(this.threadId);
        });
      } else if (this.contentId) {
        this.courseDiscussionsService.retrieveDiscussion(this.contentId, 'resource').subscribe((res: any) => {
          this.discussionThread = res.result.threads;
          this.threadId = this.discussionThread['0'] ? this.discussionThread['0'].id : '';
          this.getReplies(this.threadId);
        });
      }
    });
  }
  ngOnChanges() { }
  postComment() {
    const discussTitle = this.batchId ? 'Discussion for batch' + '-' + this.batchId :
      'Discussion for resource' + '-' + this.contentId;
    const req = {
      'title': discussTitle,
      'body': 'Discussion for batch-content',
      'contextId': this.batchId || this.contentId,
      'contextType': this.batchId ? 'batch' : 'resource'
    };
    this.courseDiscussionsService.postDiscussion(req).subscribe((res: any) => {
      if (this.batchId) {
        this.retreiveThread(this.batchId, 'batch');
      } else {
        this.retreiveThread(this.contentId, 'resource');
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
      this.totalCommentsCount = res.result.thread.repliesCount;
      this.showReplyLoader = false;
      this.showReplyLoaderforModal = false;
      this.postCancel();
      console.log('New Response');
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
  retreiveThread(id, tagType) {
    this.courseDiscussionsService.retrieveDiscussion(id, tagType).subscribe((res: any) => {
      this.discussionThread = res.result.threads;
      if (this.discussionThread.length !== 0) {
        this.threadId = this.discussionThread['0'].id;
        this.getReplies(this.threadId);
      }
    });
  }
  postCancel() {
    // this.fileInput.nativeElement.value = "";
    // this.fileInputforModal.nativeElement.value = "";
    this.editorContent = '';
    this.uploadedFile = null;
    this.editorContentForModal = '';
    this.replyPostNumber = null;
    this.selectedFile = null;
    this.postBtnText = 'Post';
  }
  getPostNumber(postNumber) {
    this.postBtnText = 'Reply';
    const scrollingElement = (document.scrollingElement || document.body);
    this.replyPostNumber = postNumber;
    // $(scrollingElement).animate({
    //   scrollBottom: 1000
    // }, 700);
    $('.ql-editor').focus();
    console.log('Post Number');
    console.log(this.replyPostNumber);
  }
  viewMoreComments(postNumber) {
    (<any>$('.ui.large.modal')).modal('setting', 'transition', 'vertical flip').modal('setting', 'closable', false).modal('show');
    this.nestedComments = _.filter(_.cloneDeep(this.repliesContent), { post_number: postNumber });
    this.postCancel();
  }
  replyToThreadFromModal() {
    this.editorContent = this.editorContentForModal;
    this.replyPostNumber = this.treeViewService.getPostNumber();
    this.replyToThread();
  }
  replyToThread() {
    const body = {
      'body': this.uploadedFile ? this.editorContent + this.uploadedFile : this.editorContent,
      'threadId': this.threadId,
      'replyPostNumber': this.replyPostNumber
    };
    this.showReplyLoader = true;
    this.showReplyLoaderforModal = true;
    this.courseDiscussionsService.replyToThread(body).subscribe((res) => {
      if (_.get(res, 'responseCode') === 'OK') {
        this.editorContent = '';
        this.uploadedFile = null;
        this.editorContentForModal = '';
        (<any>$('.ui.large.modal')).modal('hide');
        // this.postCancel();
        if (this.batchId) {
          this.retreiveThread(this.batchId, 'batch');
        } else {
          this.retreiveThread(this.contentId, 'resource');
        }
        // this.getReplies(this.threadId);
      }
      if (_.get(res, 'responseCode') === 'CLIENT_ERROR') {
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      }
    }, (err) => {
      console.log(err);
      this.toasterService.error(this.resourceService.messages.emsg.m0005);
    });
  }
  isDisabled() {
    if (!_.isEmpty(_.trim(this.editorContent)) && this.editorContent.length >= 22 && this.editorContent.length <= 1007) {
      return false;
    } else {
      return true;
    }
  }
  isDisabledforModal() {
    if (!_.isEmpty(_.trim(this.editorContentForModal)) && this.editorContentForModal.length >= 22 && this.editorContent.length <= 1007) {
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
        this.retreiveThread(this.batchId, 'batch');
      } else {
        this.retreiveThread(this.contentId, 'resource');
      }
      this.getReplies(this.threadId);
    });
  }

  fileEvent(event) {
    const file = event.target.files[0];
    this.showUploadLoader = true;
    this.selectedFile = null;
    if (_.round(file.size / 1024) <= 1024) {
      this.courseDiscussionsService.uploadFile(file).subscribe((res: any) => {
        if (res && res.result.response) {
          const url = res.result.response.url;
          // const fileName = res.result.response.original_filename;
          this.selectedFile = file.name;
          this.showUploadLoader = false;
          this.uploadedFile = '<p><a class="attachment" href=' + url + '>' + this.selectedFile + '</a></p>';
        }
      }, (err) => {
        console.log(err);
        this.showUploadLoader = false;
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      });
    } else {
      this.showUploadLoader = false;
      this.toasterService.error('The file size should be less than 1mb');
    }
    // this.challengeService.batchUpload(file).subscribe((result: any) => {
    //   if (this.utils.validatorMessage(result, KRONOS.MESSAGES.FILE_UPLOAD_SUCCESSFULLY)) {
    //     this.getAllUsersByOrg();
    //   }
    // });
  }
  fileEventforModal(event) {
    const file = event.target.files[0];
    this.showUploadLoader = true;
    this.selectedFile = null;
    if (_.round(file.size / 1024) <= 1024) {
      this.courseDiscussionsService.uploadFile(file).subscribe((res: any) => {
        if (res && res.result.response) {
          const url = res.result.response.url;
          // const fileName = file;
          this.selectedFile = file.name;
          this.showUploadLoader = false;
          this.uploadedFile = '<p><a class="attachment" href=' + url + '>' + this.selectedFile + '</a></p>';
        }
      }, (err) => {
        console.log(err);
        this.showUploadLoader = false;
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      });
    } else {
      this.showUploadLoader = false;
      this.toasterService.error('The file size should be less than 1mb');
    }
    // this.challengeService.batchUpload(file).subscribe((result: any) => {
    //   if (this.utils.validatorMessage(result, KRONOS.MESSAGES.FILE_UPLOAD_SUCCESSFULLY)) {
    //     this.getAllUsersByOrg();
    //   }
    // });
  }
  postCommentInteractEdata() {
    return {
      id: 'comments',
      type: 'click',
      pageid: this.router.url.split('/')[1]
    };
  }
}
