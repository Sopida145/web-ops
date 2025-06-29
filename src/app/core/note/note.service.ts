import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, BehaviorSubject, tap, of } from 'rxjs';
import { PageResponse } from '../base/pageResponse.types';
import { Response } from '../base/response.types';
import { SearchParameter } from '../base/parameters/searchParameter.entity';
import { Note } from './note.type';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable({ providedIn: 'root' })
export class NoteService {
    private _baseNoteUrl = '/api/notes';

    readonly apiUrl = {
        noteUrl: this._baseNoteUrl,
        noteWithIdUrl: (id: string): string => `${this._baseNoteUrl}/${id}`
    };

    private _httpClient = inject(HttpClient);
    private _noteLists: BehaviorSubject<PageResponse<Note[]>> = new BehaviorSubject<PageResponse<Note[]>>(null);
    private _note: BehaviorSubject<Note> = new BehaviorSubject<Note>(null);

    set noteLists(value: PageResponse<Note[]>) {
        this._noteLists.next(value);
    }

    set note(value: Note) {
        this._note.next(value);
    }


    get noteLists$(): Observable<PageResponse<Note[]>> {
        return this._noteLists.asObservable();
    }

    get note$(): Observable<Note> {
        return this._note.asObservable();
    }

    getNoteLists(param: SearchParameter): Observable<PageResponse<Note[]>> {
        let options = {
            params: param.toHttpParams()
        };
        return this._httpClient.get<PageResponse<Note[]>>(this.apiUrl.noteUrl,options).pipe(
            tap((note) => {
                this._noteLists.next(note);
            })
        );
    }

    getNoteById(id: string): Observable<Note> {
        return this._httpClient.get<Response<Note>>(this.apiUrl.noteWithIdUrl(id)).pipe(
            map((m: Response<Note>) => m.item),
            tap((note) => {
                this._note.next(note);
            })
        );
    }

    create(body: CreateNoteDto): Observable<any> {
        return this._httpClient.post(this.apiUrl.noteUrl, body);
    }

    update(id: string, body: UpdateNoteDto): Observable<any> {
        return this._httpClient.put(this.apiUrl.noteWithIdUrl(id), body);
    }

    delete(hn: string): Observable<any> {
        return this._httpClient.delete(this.apiUrl.noteWithIdUrl(hn));
    }
}
