import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AngularDatatableDirective} from './AngularDataTable';
import {AngularDefaultSorterComponent} from './AngularDefaultSorter';
import {AngularPaginatorComponent} from './AngularPaginator';
import {AngularBootstrapPaginatorComponent} from './AngularBootstrapPaginator';

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
