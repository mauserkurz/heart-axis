// angular
import { Routes } from "@angular/router";
// components
import { NotFoundComponent } from "./common/not_found.component/not_found.component";
import { CalcWrapperComponent } from './common/calc_wrapper.component/calc_wrapper.component';
import { IndexComponent } from './common/index.component/index.component';
import { FAQListComponent } from './common/faq_list.component/faq_list.component';

export const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'heart-axis',
    redirectTo: 'heart-axis/calculator',
    pathMatch: 'full'
  },
  {
    path: 'heart-axis',
    component: CalcWrapperComponent,
    loadChildren: './axis-heart/index#AxisHeartModule',
  },
  {
    path: 'is-arrhythmia',
    redirectTo: 'is-arrhythmia/calculator',
    pathMatch: 'full'
  },
  {
    path: 'is-arrhythmia',
    component: CalcWrapperComponent,
    loadChildren: './is-arrhythmia/index#IsArrhythmiaModule',
  },
  {
    path: 'faq-list',
    component: FAQListComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];