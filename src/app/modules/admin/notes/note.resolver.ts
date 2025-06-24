import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    ResolveFn,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { NoteService } from 'app/core/note/note.service';
import { Note } from 'app/core/note/note.type';
import { GetNoteParameter } from 'app/core/note/parameters/get-note.parameter';
import { DEF_LIMIT, Page, SortType } from 'app/core/base/page.type';
import { PageResponse } from 'app/core/base/pageResponse.types';
import { catchError, throwError } from 'rxjs';

export const noteListsResolver: ResolveFn<PageResponse<Note[]>> = (
    route,
    state
) => {
    const currPage: Page = { page: 1, limit: DEF_LIMIT, sortBy: 'updatedAt', sortType: SortType.desc };
    const noteService = inject(NoteService);
    const param = new GetNoteParameter();
    param.limit = currPage.limit;
    param.page = currPage.page;
    param.sortBy = currPage.sortBy;
    param.sortType = currPage.sortType;
    return noteService.getNoteLists(param);
};

export const noteResolver: ResolveFn<Note> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const noteService = inject(NoteService);
    const router = inject(Router);

    return noteService.getNoteById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(error);
        })
    );
};
