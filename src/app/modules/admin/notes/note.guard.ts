import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { NoteService } from 'app/core/note/note.service';
import { EditNoteComponent } from './edit/edit.component';

export const CanDeactivateUserEdit = (
    component: EditNoteComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ) => {
  
  const noteService = inject(NoteService);
  
  let nextRoute: ActivatedRouteSnapshot = nextState.root;
  while (nextRoute.firstChild) {
    nextRoute = nextRoute.firstChild;
  }

  if (!nextState.url.includes('/note')) {
    return true;
  }

  if (nextRoute.paramMap.get('hn')) {
    return true;
  }

  
  return component.closeDrawer().then(() => {
    noteService.note = null;
    return true
  });
  
};