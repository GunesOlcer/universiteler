// src/app/features/static-pages/static-pages.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StaticPagesRoutingModule } from './static-pages-routing.module';
import { FaqComponent } from './faq/faq.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { AboutComponent } from './about/about.component';
import { StaticSidebarComponent } from './static-sidebar/static-sidebar.component';

@NgModule({
  declarations: [
    FaqComponent,
    PrivacyComponent,
    TermsComponent,
    CookiePolicyComponent,
    AboutComponent,
    StaticSidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    StaticPagesRoutingModule
  ]
})
export class StaticPagesModule { }