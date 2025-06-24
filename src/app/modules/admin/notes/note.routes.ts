import { Routes } from '@angular/router';
import { CanDeactivateUserEdit } from './note.guard';
import { noteListsResolver, noteResolver } from './note.resolver';
import { NoteComponent } from './note.component';
import { EditNoteComponent } from './edit/edit.component';
import { NoteListComponent } from './list/list.component';

export default [
    {
        path: '',
        component: NoteComponent,
        children: [
            {
                path: '',
                component: NoteListComponent,
                resolve: {
                    initialData: noteListsResolver,
                },
                children: [
                    {
                        path: 'create',
                        component: EditNoteComponent,
                        canDeactivate: [CanDeactivateUserEdit],
                    },
                    {
                        path: 'edit/:id',
                        component: EditNoteComponent,
                        resolve: {
                            initialData: noteResolver,
                        },
                        canDeactivate: [CanDeactivateUserEdit],
                    },
                ],
            },
        ],
    },
] as Routes;
