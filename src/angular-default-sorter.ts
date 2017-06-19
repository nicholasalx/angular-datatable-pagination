import {Component, Input, OnInit} from '@angular/core';
import {AngularDatatableDirective, SortEvent} from './angular-datatable.directive';

@Component({
    selector: 'angular-default-sorter',
    template: `
        <a style="cursor: pointer" (click)="sort()" class="text-nowrap">
            <ng-content></ng-content>
            <span *ngIf="isSortedByMeAsc" class="glyphicon glyphicon-triangle-top"></span>
            <span *ngIf="isSortedByMeDesc" class="glyphicon glyphicon-triangle-bottom"></span>
        </a>`
})
export class AngularDefaultSorterComponent implements OnInit {
    @Input('sortBy') sortBy: string;

    isSortedByMeAsc = false;
    isSortedByMeDesc = false;

    public constructor(private mfTable: AngularDatatableDirective) {
    }

    public ngOnInit(): void {
        this.mfTable.onSortChange.subscribe((event: SortEvent) => {
            this.isSortedByMeAsc = (event.sortBy === this.sortBy && event.sortOrder === 'asc');
            this.isSortedByMeDesc = (event.sortBy === this.sortBy && event.sortOrder === 'desc');
        });
    }

    sort() {
        if (this.isSortedByMeAsc) {
            this.mfTable.setSort(this.sortBy, 'desc');
        } else {
            this.mfTable.setSort(this.sortBy, 'asc');
        }
    }
}
