import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AffiliateComponent } from './affiliate.component';
import { DemoAffiliateListComponent } from './demo-affiliate-list/affiliate-list.component';
import { VisitorAffiliateListComponent } from './visitor-affiliate-list/affiliate-list.component';
import { PremiumAffiliateListComponent } from './premium-affiliate-list/affiliate-list.component';
import { AffiliateProfileComponent } from './affiliate-profile/affiliate-profile.component';
const routes: Routes = [
  {
    path: '',
    component: AffiliateComponent,
    children: [
      
      {
        path: 'demoaffiliate',
        component: DemoAffiliateListComponent
      },
      {
        path: 'visitoraffiliate',
        component: VisitorAffiliateListComponent
      },
      {
        path: 'premiumaffiliate',
        component: PremiumAffiliateListComponent
      },
      {
        path: 'affiliateprofile/:id',
        component: AffiliateProfileComponent
      },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AffiliateRoutingModule { }
