import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  @Input() items: any[] = [];
  
  // Optional home path for the dashboard link
  @Input() homePath: string = '/admin/dashboard';
}