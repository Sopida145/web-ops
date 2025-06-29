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
import { PatienceService } from 'app/core/patience/patience.service';
import { Patience } from 'app/core/patience/patience.type';
import { CreatePatienceDto } from 'app/core/patience/dto/create-patience.dto';
import { UpdatePatienceDto } from 'app/core/patience/dto/update-patience.dto';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { PatienceListComponent } from '../list/list.component';
import { last } from 'lodash';

@Component({
    selector: 'app-edit-patience',
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
export class EditPatienceComponent implements OnInit {
    isEdit: boolean = false;
    initForm: FormGroup = null;
    patienceId: string;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    disableSave: boolean = false;

    get name() {
        return this.initForm.get('name');
        
    }

   
    constructor(
        private _formBuilder: FormBuilder,
        private _listPatienceComponent: PatienceListComponent,
        private _router: Router,
        private _route: ActivatedRoute,
        private _patienceService: PatienceService,
        private _fuseConfirmationService: FuseConfirmationService,
        private cdr: ChangeDetectorRef
    ) {
        this.patienceId = this._route.snapshot.paramMap.get('id');
        this.isEdit = !!this.patienceId;
    }

    ngOnInit(): void {
        this._listPatienceComponent.matDrawer.open();

        this._patienceService.patience$
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe((resp: Patience) => {
                console.log(resp);
                this.initForm = this.initialForm(resp);
            });
    }

    initialForm(patience?: Patience): FormGroup {
        return this._formBuilder.group(
            {
                hn: [patience?.hn || '', [Validators.required]],
                firstName: [patience?.firstName || '', [Validators.required]],
                lastName: [patience?.lastName || '', [Validators.required]],
                dob: [patience?.dob || '', [Validators.required]],
                idCard: [patience?.idCard || '', [Validators.required]],
                phone: [patience?.phone || '', [Validators.required]],
                Address: [patience?.Address || '', [Validators.required]],
                // id: [patience?.id || '', [Validators.required]], // เพิ่ม id ที่นี่

                

                

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
        this.update(this.patienceId, payload);
    } else {
        this.create(payload);
    }
    }

    create(body: CreatePatienceDto): void {
        this._patienceService
            .create(body)
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe({
                next: (res) => {
                    this._listPatienceComponent.fetchData();
                    this.onClose();
                    this._fuseConfirmationService.alertSuccess();
                },
                error: (err) => {
                    this.disableSave = false;
                    this.cdr.detectChanges();
                },
            });
    }

    update(id: string, body: UpdatePatienceDto): void {
        this._patienceService
            .update(id, body)
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe({
                next: (res) => {
                    this._listPatienceComponent.fetchData();
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
        return this._listPatienceComponent.matDrawer.close();
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
