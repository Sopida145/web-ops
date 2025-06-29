import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    QueryList,
    SimpleChanges,
    ViewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Patience } from 'app/core/patience/patience.type';
import { UpdatePatienceDto } from 'app/core/patience/dto/update-patience.dto';
import { PageResponse } from 'app/core/base/pageResponse.types';

@Component({
    selector: 'app-table-patience',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIcon,
        MatMenuModule,
        MatSelectModule,
    ],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss',
})
export class TablePatienceComponent implements OnChanges {
    @ViewChildren('selectStatus') selectStatues: QueryList<MatSelect>;

    @Input() patienceResp: PageResponse<Patience[]>;
    @Output() delete: EventEmitter<Patience> = new EventEmitter<Patience>(null);
    @Output() edit: EventEmitter<Patience> = new EventEmitter<Patience>(null);
    @Output() updateStatus: EventEmitter<{id: string, body: UpdatePatienceDto}> = new EventEmitter<{id: string, body: UpdatePatienceDto}>(null);
    @Output() changePage: EventEmitter<PageEvent> = new EventEmitter<PageEvent>(
        null
    );

    displayedColumns: string[] = [
        'hn',
        // 'id',
        'firstName',
        'lastName',
        'gender',
        'dob',
        'idCard',
        'phone',
        'Address',
        'edit'
    ];
    dataSource: Patience[] = [];

    constructor(
        private _fuseConfirmationService: FuseConfirmationService,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.dataSource = this.patienceResp.items;
    }

    onChangePage(event: PageEvent) {
        event.pageIndex = event.pageIndex + 1;
        this.changePage.emit(event);
    }
}
