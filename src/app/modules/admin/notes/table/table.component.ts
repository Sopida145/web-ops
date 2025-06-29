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
import { Note } from 'app/core/note/note.type';
import { UpdateNoteDto } from 'app/core/note/dto/update-note.dto';
import { PageResponse } from 'app/core/base/pageResponse.types';

@Component({
    selector: 'app-table-note',
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
export class TableNoteComponent implements OnChanges {
    @ViewChildren('selectStatus') selectStatues: QueryList<MatSelect>;

    @Input() noteResp: PageResponse<Note[]>;
    @Output() delete: EventEmitter<Note> = new EventEmitter<Note>(null);
    @Output() edit: EventEmitter<Note> = new EventEmitter<Note>(null);
    @Output() updateStatus: EventEmitter<{id: string, body: UpdateNoteDto}> = new EventEmitter<{id: string, body: UpdateNoteDto}>(null);
    @Output() changePage: EventEmitter<PageEvent> = new EventEmitter<PageEvent>(
        null
    );

    displayedColumns: string[] = [
        'hn',
        'bloodPressure',
        's',
        'o',
        'a',
        'p',
        'edit',
    ];
    dataSource: Note[] = [];

    constructor(
        private _fuseConfirmationService: FuseConfirmationService,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.dataSource = this.noteResp.items;
    }

    onChangePage(event: PageEvent) {
        event.pageIndex = event.pageIndex + 1;
        this.changePage.emit(event);
    }
}
