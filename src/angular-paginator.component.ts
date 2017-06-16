import {Component, Input, SimpleChange, OnChanges, Optional} from '@angular/core';
import {AngularDatatableDirective, PageEvent} from './AngularDatatable';

@Component({
    selector: 'angular-paginator',
    template: `<ng-content></ng-content>`
})
export class AngularPaginatorComponent implements OnChanges {

    @Input('mfTable') inputMfTable: AngularDatatableDirective;

    private mfTable: AngularDatatableDirective;

    public activePage: number;
    public rowsOnPage: number;
    public dataLength = 0;
    public lastPage: number;

    public constructor(@Optional() private injectMfTable: AngularDatatableDirective) {
    }

    public ngOnChanges(changes: {[key: string]: SimpleChange}): any {
        this.mfTable = this.inputMfTable || this.injectMfTable;
        this.onPageChangeSubscriber(this.mfTable.getPage());
        this.mfTable.onPageChange.subscribe(this.onPageChangeSubscriber);
    }

    public setPage(pageNumber: number): void {
        this.mfTable.setPage(pageNumber, this.rowsOnPage);
    }

    public setRowsOnPage(rowsOnPage: number): void {
        this.mfTable.setPage(this.activePage, rowsOnPage);
    }

    private onPageChangeSubscriber = (event: PageEvent) => {
        this.activePage = event.activePage;
        this.rowsOnPage = event.rowsOnPage;
        this.dataLength = event.dataLength;
        this.lastPage = Math.ceil(this.dataLength / this.rowsOnPage);
    }
}
