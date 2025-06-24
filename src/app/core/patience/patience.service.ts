import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, BehaviorSubject, tap, of } from 'rxjs';
import { PageResponse } from '../base/pageResponse.types';
import { Response } from '../base/response.types';
import { SearchParameter } from '../base/parameters/searchParameter.entity';
import { Patience } from './patience.type';
import { CreatePatienceDto } from './dto/create-patience.dto';
import { UpdatePatienceDto } from './dto/update-patience.dto';

@Injectable({ providedIn: 'root' })
export class PatienceService {
    private _basePatienceUrl = '/api/patiences';

    readonly apiUrl = {
        patienceUrl: this._basePatienceUrl,
        patienceWithIdUrl: (hn: string): string => `${this._basePatienceUrl}/${hn}`
    };

    private _httpClient = inject(HttpClient);
    private _patienceLists: BehaviorSubject<PageResponse<Patience[]>> = new BehaviorSubject<PageResponse<Patience[]>>(null);
    private _patience: BehaviorSubject<Patience> = new BehaviorSubject<Patience>(null);

    set patienceLists(value: PageResponse<Patience[]>) {
        this._patienceLists.next(value);
    }

    set patience(value: Patience) {
        this._patience.next(value);
    }


    get patienceLists$(): Observable<PageResponse<Patience[]>> {
        return this._patienceLists.asObservable();
    }

    get patience$(): Observable<Patience> {
        return this._patience.asObservable();
    }

    getPatienceLists(param: SearchParameter): Observable<PageResponse<Patience[]>> {
        let options = {
            params: param.toHttpParams()
        };
        return this._httpClient.get<PageResponse<Patience[]>>(this.apiUrl.patienceUrl,options).pipe(
            tap((patience) => {
                this._patienceLists.next(patience);
            })
        );
    }

    getPatienceById(id: string): Observable<Patience> {
        return this._httpClient.get<Response<Patience>>(this.apiUrl.patienceWithIdUrl(id)).pipe(
            map((m: Response<Patience>) => m.item),
            tap((patience) => {
                this._patience.next(patience);
            })
        );
    }

    create(body: CreatePatienceDto): Observable<any> {
        return this._httpClient.post(this.apiUrl.patienceUrl, body);
    }

    update(hn: string, body: UpdatePatienceDto): Observable<any> {
        return this._httpClient.put(this.apiUrl.patienceWithIdUrl(hn), body);
    }

    delete(hn: string): Observable<any> {
        return this._httpClient.delete(this.apiUrl.patienceWithIdUrl(hn));
    }
}
