import {Component, Input, SimpleChange, OnChanges, Optional} from '@angular/core';
import {AngularDatatableDirective, PageEvent} from './angular-datatable.directive';

@Component({
    selector: 'angular-paginator',
    template: `<ng-content></ng-content>`
})
export class AngularPaginatorComponent implements OnChanges {

    @Input('angularDatatableDirective') angularDatatableDirective: AngularDatatableDirective;

    private _angularDatatableDirective: AngularDatatableDirective;

    public activePage: number;
    public rowsOnPage: number;
    public dataLength = 0;
    public lastPage: number;

    public constructor(@Optional() private injectedAngularDatatableDirective: AngularDatatableDirective) {
    }

    public ngOnChanges(changes: {[key: string]: SimpleChange}): any {
        this._angularDatatableDirective = this.injectedAngularDatatableDirective || this.injectedAngularDatatableDirective;
        this.onPageChangeSubscriber(this._angularDatatableDirective.getPage());
        this._angularDatatableDirective.onPageChange.subscribe(this.onPageChangeSubscriber);
    }

    public setPage(pageNumber: number): void {
        this._angularDatatableDirective.setPage(pageNumber, this.rowsOnPage);
    }

    public setRowsOnPage(rowsOnPage: number): void {
        this._angularDatatableDirective.setPage(this.activePage, rowsOnPage);
    }

    private onPageChangeSubscriber = (event: PageEvent) => {
        this.activePage = event.activePage;
        this.rowsOnPage = event.rowsOnPage;
        this.dataLength = event.dataLength;
        this.lastPage = Math.ceil(this.dataLength / this.rowsOnPage);
    }
}
