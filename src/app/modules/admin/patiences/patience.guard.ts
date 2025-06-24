import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { PatienceService } from 'app/core/patience/patience.service';
import { EditPatienceComponent } from './edit/edit.component';

export const CanDeactivateUserEdit = (
    component: EditPatienceComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ) => {
  
  const patienceService = inject(PatienceService);
  
  let nextRoute: ActivatedRouteSnapshot = nextState.root;
  while (nextRoute.firstChild) {
    nextRoute = nextRoute.firstChild;
  }

  if (!nextState.url.includes('/patience')) {
    return true;
  }

  if (nextRoute.paramMap.get('hn')) {
    return true;
  }

  
  return component.closeDrawer().then(() => {
    patienceService.patience = null;
    return true
  });
  
};