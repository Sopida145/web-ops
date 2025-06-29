import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NoteService } from 'app/core/note/note.service';
import { Note } from 'app/core/note/note.type';
import { CreateNoteDto } from 'app/core/note/dto/create-note.dto';
import { UpdateNoteDto } from 'app/core/note/dto/update-note.dto';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { NoteListComponent } from '../list/list.component';

@Component({
    selector: 'app-edit-note',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatCheckboxModule,
        MatSelectModule,
        MatDatepickerModule,
    ],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.scss',
})
export class EditNoteComponent implements OnInit {
    isEdit: boolean = false;
    initForm: FormGroup = null;
    noteId: string;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    disableSave: boolean = false;

    get name() {
        return this.initForm.get('name');
    }

    constructor(
        private _formBuilder: FormBuilder,
        private _listNoteComponent: NoteListComponent,
        private _router: Router,
        private _route: ActivatedRoute,
        private _noteService: NoteService,
        private _fuseConfirmationService: FuseConfirmationService,
        private cdr: ChangeDetectorRef
    ) {
        this.noteId = this._route.snapshot.paramMap.get('id');
        this.isEdit = !!this.noteId;
    }

    ngOnInit(): void {
        this._listNoteComponent.matDrawer.open();

        this._noteService.note$
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe((resp: Note) => {
                console.log(resp);
                this.initForm = this.initialForm(resp);
            });
    }

    initialForm(note?: Note): FormGroup {
        return this._formBuilder.group(
            {
                
                hn: [note?.hn || '', [Validators.required]],
                bloodPressure: [note?.bloodPressure || '', [Validators.required]],
                s: [note?.s || '', [Validators.required]],
                o: [note?.o || '', [Validators.required]],
                a: [note?.a || '', [Validators.required]],
                p: [note?.p || '', [Validators.required]],
                
                
                
            }
        );
    }


    onSave(): void {
        this.disableSave = true;
        const formValue = this.initForm.getRawValue();


        // ✅ แปลง hn เป็น string
    const payload = {
        ...formValue,
        hn: formValue.hn?.toString() ?? ''  // ป้องกัน null ด้วย
    };
        
        if (this.isEdit) {
            this.update(this.noteId, payload);
        } else {
            this.create(payload);
        }
    }

    create(body: CreateNoteDto): void {
        this._noteService
            .create(body)
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe({
                next: (res) => {
                    this._listNoteComponent.fetchData();
                    this.onClose();
                    this._fuseConfirmationService.alertSuccess();
                },
                error: (err) => {
                    console.error('❌ Create note error:', err);  // เพิ่ม log ดู error
                    this.disableSave = false;
                    this.cdr.detectChanges();
                    this._fuseConfirmationService.alertError('Failed to create note'); // แจ้งผู้ใช้
                },
            });
    }
    update(id: string, body: UpdateNoteDto): void {
        this._noteService
            .update(id, body)
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe({
                next: (res) => {
                    this._listNoteComponent.fetchData();
                    this.onClose();
                    this._fuseConfirmationService.alertSuccess();
                },
                error: (err) => {
                    this.disableSave = false;
                    this.cdr.detectChanges();
                },
            });
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._listNoteComponent.matDrawer.close();
    }

    onClose(): void {
        if (this.isEdit) {
            this.backFromUpdate();
        } else {
            this.backFromCreate();
        }
    }

    backFromCreate(): void {
        this._router.navigate(['../'], { relativeTo: this._route });
    }

    backFromUpdate(): void {
        this._router.navigate(['../../'], { relativeTo: this._route });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
