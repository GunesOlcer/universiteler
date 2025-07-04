// src/app/features/static-pages/static-pages-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqComponent } from './faq/faq.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { path: 'sss', component: FaqComponent },
  { path: 'gizlilik-politikasi', component: PrivacyComponent },
  { path: 'kullanim-kosullari', component: TermsComponent },
  { path: 'cerez-politikasi', component: CookiePolicyComponent },
  { path: 'hakkimizda', component: AboutComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticPagesRoutingModule { }