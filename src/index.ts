import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AngularDatatableDirective} from './angular-datatable.directive';
import {AngularDefaultSorterComponent} from './angular-default-sorter';
import {AngularPaginatorComponent} from './angular-paginator.component';
import {AngularBootstrapPaginatorComponent} from './angular-bootstrap-paginator.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        AngularDatatableDirective,
        AngularDefaultSorterComponent,
        AngularPaginatorComponent,
        AngularBootstrapPaginatorComponent
    ],
    exports: [
        AngularDatatableDirective,
        AngularDefaultSorterComponent,
        AngularPaginatorComponent,
        AngularBootstrapPaginatorComponent
    ]
})
export class AngularDatatableModule {

}
