// angular
import { Routes } from "@angular/router";
// components
import { NotFoundComponent } from "./common/not_found.component/not_found.component";
import { CalcWrapperComponent } from './common/calc_wrapper.component/calc_wrapper.component';
import { IndexComponent } from './common/index.component/index.component';
import { FAQListComponent } from './common/faq_list.component/faq_list.component';
// child routes
import { routes as heartAxisRoutes } from './axis-heart';
import { routes as arrhythmiaRoutes } from './is-arrhythmia';
import { routes as qtcRoutes } from './qtc';

export const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
  },
  {
    path: 'heart-axis',
    component: CalcWrapperComponent,
    children: heartAxisRoutes,
  },
  {
    path: 'is-arrhythmia',
    component: CalcWrapperComponent,
    children: arrhythmiaRoutes,
  },
  {
    path: 'qtc',
    component: CalcWrapperComponent,
    children: qtcRoutes,
  },
  {
    path: 'faq-list',
    component: FAQListComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];