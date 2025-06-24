import { Routes } from '@angular/router';
import { CanDeactivateUserEdit } from './patience.guard';
import { patienceListsResolver, patienceResolver } from './patience.resolver';
import { PatienceComponent } from './patience.component';
import { EditPatienceComponent } from './edit/edit.component';
import { PatienceListComponent } from './list/list.component';

export default [
    {
        path: '',
        component: PatienceComponent,
        children: [
            {
                path: '',
                component: PatienceListComponent,
                resolve: {
                    initialData: patienceListsResolver,
                },
                children: [
                    {
                        path: 'create',
                        component: EditPatienceComponent,
                        canDeactivate: [CanDeactivateUserEdit],
                    },
                    {
                        path: 'edit/:id',
                        component: EditPatienceComponent,
                        resolve: {
                            initialData: patienceResolver,
                        },
                        canDeactivate: [CanDeactivateUserEdit],
                    },
                ],
            },
        ],
    },
] as Routes;
