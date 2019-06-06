import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganisationComponent, CourseConsumptionComponent, CourseProgressComponent, UsageReportsComponent, ContentCreationStaticsComponent, CityWiseReportComponent, DeptCityWiseReportComponent, ContentDeptWiseReportComponent, TotalUserComponent } from './components/';
import { AuthGuard } from '../core/guard/auth-gard.service';

const routes: Routes = [
  {
    path: 'myActivity', component: CourseConsumptionComponent,
    data: {
      telemetry: { env: 'course', pageid: 'course-creator-dashboard', type: 'view' },
      breadcrumbs: [{ label: 'Home', url: '/home' },
      { label: 'Course', url: '/learn' }, { label: 'Course Creator Dashboard', url: '' }]
    }
  },
  {
    path: 'activity/course/consumption/:id/:timePeriod', component: CourseConsumptionComponent,
    data: {
      telemetry: { env: 'course', pageid: 'course-creator-dashboard', type: 'view' },
      breadcrumbs: [{ label: 'Home', url: '/home' },
      { label: 'Course', url: '/learn' }, { label: 'Course Creator Dashboard', url: '' }]
    }
  },
  {
    path: 'orgDashboard', component: UsageReportsComponent, canActivate: [AuthGuard],
    data: {
      roles: 'dashboardRole',
      telemetry: { env: 'dashboard', pageid: 'org-admin-dashboard', type: 'view' },
      breadcrumbs: [{ label: 'Home', url: '/home' },
      { label: 'Profile', url: '/profile' }, { label: 'Organization Admin Dashboard', url: '' }]
    }
  },
  {
    // path: 'orgDashboard/organization/:datasetType/:id/:timePeriod', component: OrganisationComponent,
    path: 'orgDashboard/organization/creation/:id/:timePeriod', component: OrganisationComponent,
    data: {
      telemetry: { env: 'profile', pageid: 'org-admin-dashboard', type: 'view' },
      breadcrumbs: [{ label: 'Home', url: '/home' },
      { label: 'Profile', url: '/profile' }, { label: 'Organization Admin Dashboard', url: '' }]
    }
  },
  {
    path: 'contentcreationstatics', component: ContentCreationStaticsComponent, canActivate: [AuthGuard],
    data: {
      roles: 'dashboardRole',
      telemetry: { env: 'contentcreationstatics', pageid: 'content-creation-statics', type: 'view' },
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Content Creation Statics', url: '' }]
    }
  },
  {
    path: 'citywise', component: CityWiseReportComponent, canActivate: [AuthGuard],
    data: {
      roles: 'dashboardRole',
      telemetry: { env: 'citywise', pageid: 'city-wise-report', type: 'view' },
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'City Wise', url: '' }]
    }
  },
  {
    path: 'deptcitywise', component: DeptCityWiseReportComponent, canActivate: [AuthGuard],
    data: {
      roles: 'dashboardRole',
      telemetry: { env: 'deptcitywise', pageid: 'dept-city-wise-report', type: 'view' },
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Department City Wise', url: '' }]
    }
  },
  {
    path: 'contentdeptwise', component: ContentDeptWiseReportComponent, canActivate: [AuthGuard],
    data: {
      roles: 'dashboardRole',
      telemetry: { env: 'contentdeptwise', pageid: 'content-dept-wise-report', type: 'view' },
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Content Department Wise', url: '' }]
    }
  },
  {
    path: 'totalusers', component: TotalUserComponent, canActivate: [AuthGuard],
    data: {
      roles: 'dashboardRole',
      telemetry: { env: 'totalusers', pageid: 'total-users', type: 'view' },
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Total Users', url: '' }]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
