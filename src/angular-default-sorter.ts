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

    public constructor(private angularDatatableDirective: AngularDatatableDirective) {
    }

    public ngOnInit(): void {
        this.angularDatatableDirective.onSortChange.subscribe((event: SortEvent) => {
            this.isSortedByMeAsc = (event.sortBy === this.sortBy && event.sortOrder === 'asc');
            this.isSortedByMeDesc = (event.sortBy === this.sortBy && event.sortOrder === 'desc');
        });
    }

    sort() {
        if (this.isSortedByMeAsc) {
            this.angularDatatableDirective.setSort(this.sortBy, 'desc');
        } else {
            this.angularDatatableDirective.setSort(this.sortBy, 'asc');
        }
    }
}
