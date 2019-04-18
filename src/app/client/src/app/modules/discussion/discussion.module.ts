import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscussionComponent } from './component';
import { CourseDiscussService } from './services';
import { DiscussionService } from './services';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TelemetryModule } from './../telemetry/telemetry.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    TelemetryModule
  ],
  providers: [CourseDiscussService, DiscussionService],
  exports: [DiscussionComponent, TelemetryModule],
  declarations: [DiscussionComponent]
})
export class DiscussionModule { }
