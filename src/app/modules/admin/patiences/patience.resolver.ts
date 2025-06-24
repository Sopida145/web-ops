import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    ResolveFn,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { PatienceService } from 'app/core/patience/patience.service';
import { Patience } from 'app/core/patience/patience.type';
import { GetPatienceParameter } from 'app/core/patience/parameters/get-patience.parameter';
import { DEF_LIMIT, Page, SortType } from 'app/core/base/page.type';
import { PageResponse } from 'app/core/base/pageResponse.types';
import { catchError, throwError } from 'rxjs';

export const patienceListsResolver: ResolveFn<PageResponse<Patience[]>> = (
    route,
    state
) => {
    const currPage: Page = { page: 1, limit: DEF_LIMIT, sortBy: 'updatedAt', sortType: SortType.desc };
    const patienceService = inject(PatienceService);
    const param = new GetPatienceParameter();
    param.limit = currPage.limit;
    param.page = currPage.page;
    param.sortBy = currPage.sortBy;
    param.sortType = currPage.sortType;
    return patienceService.getPatienceLists(param);
};

export const patienceResolver: ResolveFn<Patience> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const patienceService = inject(PatienceService);
    const router = inject(Router);

    return patienceService.getPatienceById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(error);
        })
    );
};
