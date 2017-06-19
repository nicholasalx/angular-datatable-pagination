import {SimpleChange, Component} from '@angular/core';
import {AngularDatatableDirective, PageEvent, SortEvent} from './angular-angularDatatable.directive';
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {} from 'jasmine';
import * as _ from 'lodash';

@Component({
    template: `<table [angularDatatableDirective]="[]"></table>`
})
class TestComponent {
}

describe('DataTable directive tests', () => {
    let angularDatatable: AngularDatatableDirective;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AngularDatatableDirective, TestComponent]
        });
        fixture = TestBed.createComponent(TestComponent);
        angularDatatable = fixture.debugElement.query(By.directive(AngularDatatableDirective))
                .injector.get(AngularDatatableDirective) as AngularDatatableDirective;
        angularDatatable.isServerPaginationage = false;
        angularDatatable.inputData = [
            {id: 3, name: 'banana'},
            {id: 1, name: 'Duck'},
            {id: 2, name: 'ącki'},
            {id: 5, name: 'Ðrone'},
            {id: 4, name: 'Ananas'}
        ];
        angularDatatable.ngOnChanges({inputData: new SimpleChange(null, angularDatatable.inputData, true)});
    });

    describe('initializing', () => {

        it('data should be empty array if inputData is undefined or null', () => {
            angularDatatable.ngOnChanges({inputData: new SimpleChange(null, null, true)});
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual([]);
        });

        it('data should be equal to inputData', () => {
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual(angularDatatable.inputData);
        });

        it('data should be 2 first items', () => {
            angularDatatable.rowsOnPage = 2;
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual([{id: 3, name: 'banana'}, {id: 1, name: 'Duck'}]);
        });

        it('data should be 3. and 4. items', () => {
            angularDatatable.rowsOnPage = 2;
            angularDatatable.activePage = 2;
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual([{id: 2, name: 'ącki'}, {id: 5, name: 'Ðrone'}]);
        });

        it('shouldn\'t recalculate data when no changes', () => {
            angularDatatable.ngDoCheck();
            const data = angularDatatable.data;
            angularDatatable.ngOnChanges({});
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toBe(data);
        });
    });

    describe('pagination', () => {

        beforeEach(() => {
            angularDatatable.isServerPaginationage = false;
            angularDatatable.rowsOnPage = 2;
            angularDatatable.ngDoCheck();
        });

        it('should return current page settings', () => {
            expect(angularDatatable.getPage()).toEqual({activePage: 1, rowsOnPage: 2, dataLength: 5});
        });

        it('data should be 3. and 4. items when page change', () => {
            angularDatatable.setPage(2, 2);
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual([{id: 2, name: 'ącki'}, {id: 5, name: 'Ðrone'}]);
        });

        it('data should be three first items when page change', () => {
            angularDatatable.setPage(1, 3);
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual([{id: 3, name: 'banana'}, {id: 1, name: 'Duck'}, {id: 2, name: 'ącki'}]);
        });

        it('data should be two last items when page change', () => {
            angularDatatable.setPage(2, 3);
            angularDatatable.setPage(2, 3);
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual([{id: 5, name: 'Ðrone'}, {id: 4, name: 'Ananas'}]);
        });

        it('should change rowsOnPage when mfRowsOnPage changed', (done) => {
            angularDatatable.rowsOnPage = 2;
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual([{id: 3, name: 'banana'}, {id: 1, name: 'Duck'}]);

            angularDatatable.onPageChange.subscribe((pageOptions: PageEvent) => {
                expect(pageOptions.rowsOnPage).toEqual(3);
                done();
            });

            angularDatatable.rowsOnPage = 3;
            angularDatatable.ngOnChanges({rowsOnPage: new SimpleChange(2, 3, true)});
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual([{id: 3, name: 'banana'}, {id: 1, name: 'Duck'}, {id: 2, name: 'ącki'}]);
        });
    });

    describe('sorting', () => {

        it('id should return current sort setting', () => {
            angularDatatable.setSort('id', 'desc');
            expect(angularDatatable.getSort()).toEqual({sortBy: 'id', sortOrder: 'desc'});
        });

        it('should sort data after sorting input value changed', () => {
            angularDatatable.ngDoCheck();
            angularDatatable.sortBy = 'id';
            angularDatatable.sortOrder = 'asc';
            angularDatatable.ngOnChanges({
                sortBy: new SimpleChange(null, angularDatatable.sortBy, true ),
                sortOrder: new SimpleChange(null, angularDatatable.sortOrder, true)
            });
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual([
                {id: 1, name: 'Duck'},
                {id: 2, name: 'ącki'},
                {id: 3, name: 'banana'},
                {id: 4, name: 'Ananas'},
                {id: 5, name: 'Ðrone'}
            ]);
        });

        it('should fire onSortChange event after sorting input value changed', (done) => {
            angularDatatable.onSortChange.subscribe((event: SortEvent) => {
                expect(event.sortBy).toEqual('id');
                expect(event.sortOrder).toEqual('desc');
                done();
            });
            angularDatatable.ngDoCheck();
            angularDatatable.sortBy = 'id';
            angularDatatable.sortOrder = 'desc';
            angularDatatable.ngOnChanges({
                sortBy: new SimpleChange(null, angularDatatable.sortBy, true),
                sortOrder: new SimpleChange(null, angularDatatable.sortOrder, true)
            });
            angularDatatable.ngDoCheck();

        });

        it('should set sortOrder to \'asc\' if not provided', (done) => {
            angularDatatable.onSortChange.subscribe((event: SortEvent) => {
                expect(event.sortBy).toEqual('id');
                expect(event.sortOrder).toEqual('asc');
                done();
            });
            angularDatatable.ngDoCheck();
            angularDatatable.sortBy = 'id';
            angularDatatable.ngOnChanges({
                sortBy: new SimpleChange(null, angularDatatable.sortBy, true)
            });
            angularDatatable.ngDoCheck();
            expect(angularDatatable.sortOrder).toEqual('asc');
        });

        it('should set sortOrder to \'asc\' if provided something else than \'asc\' or \'desc\'', (done) => {
            angularDatatable.onSortChange.subscribe((event: SortEvent) => {
                expect(event.sortBy).toEqual('id');
                expect(event.sortOrder).toEqual('asc');
                done();
            });
            angularDatatable.ngDoCheck();
            angularDatatable.sortBy = 'id';
            angularDatatable.sortOrder = 'bulb';
            angularDatatable.ngOnChanges({
                sortBy: new SimpleChange(null, angularDatatable.sortBy, true),
                sortOrder: new SimpleChange(null, angularDatatable.sortOrder, true)
            });
            angularDatatable.ngDoCheck();
            expect(angularDatatable.sortOrder).toEqual('asc');
            expect(angularDatatable.data).toEqual([
                {id: 1, name: 'Duck'},
                {id: 2, name: 'ącki'},
                {id: 3, name: 'banana'},
                {id: 4, name: 'Ananas'},
                {id: 5, name: 'Ðrone'}
            ]);
        });

        it('shouldn\'t change order when only order provided', (done) => {
            done();
            angularDatatable.onSortChange.subscribe(() => {
                done.fail('OnSortChange shouldn\'t been fired');
            });
            angularDatatable.ngDoCheck();
            angularDatatable.sortOrder = 'desc';
            angularDatatable.ngOnChanges({sortOrder: new SimpleChange(null, angularDatatable.sortOrder, true)});
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual(angularDatatable.inputData);
        });

        it('should call output event when sorting changed', (done) => {
            angularDatatable.ngDoCheck();
            angularDatatable.sortByChange.switchMap((sortBy: string) => {
                expect(sortBy).toEqual('id');
                return angularDatatable.sortOrderChange;
            }).subscribe((sortOrder: string) => {
                expect(sortOrder).toEqual('desc');
                done();
            });

            angularDatatable.setSort('id', 'desc');
        });

        it('shouldn\'t call output event when sortOrder fixed', (done) => {
            angularDatatable.ngDoCheck();
            angularDatatable.sortOrderChange.subscribe(() => {
                done.fail('Shouldn\'t call sortOrderChange');
            });
            done();
            angularDatatable.sortOrder = 'bulb';
            angularDatatable.ngOnChanges({sortOrder: new SimpleChange(null, angularDatatable.sortOrder, true)});
            angularDatatable.ngDoCheck();
        });
        // Wywołanie outputa gdy zmiana z innej strony

        it('shouldn\'t refresh data when set page with same settings', () => {
            angularDatatable.setSort('name', 'asc');
            angularDatatable.ngDoCheck();
            const data = angularDatatable.data;
            angularDatatable.setSort('name', 'asc');
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toBe(data);
        });

        it('should sort data ascending by name', () => {
            angularDatatable.setSort('name', 'asc');
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual([
                {id: 4, name: 'Ananas'},
                {id: 3, name: 'banana'},
                {id: 1, name: 'Duck'},
                {id: 5, name: 'Ðrone'},
                {id: 2, name: 'ącki'}
            ]);
        });

        it('should sort data descending by id', () => {
            angularDatatable.setSort('id', 'desc');
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual([
                {id: 5, name: 'Ðrone'},
                {id: 4, name: 'Ananas'},
                {id: 3, name: 'banana'},
                {id: 2, name: 'ącki'},
                {id: 1, name: 'Duck'}
            ]);
        });

        it('should sort data by two values', () => {
            const newData = [
                {name: 'Claire', age: 9},
                {name: 'Anna', age: 34},
                {name: 'Claire', age: 16},
                {name: 'Claire', age: 7},
                {name: 'Anna', age: 12}
            ];
            angularDatatable.ngOnChanges({inputData: new SimpleChange(angularDatatable.inputData, newData, true)});
            angularDatatable.setSort(['name', 'age'], 'asc');
            angularDatatable.ngDoCheck();

            expect(angularDatatable.data).toEqual([
                {name: 'Anna', age: 12},
                {name: 'Anna', age: 34},
                {name: 'Claire', age: 7},
                {name: 'Claire', age: 9},
                {name: 'Claire', age: 16}
            ]);
        });

        it('should sort data by child property value', () => {
            const newData = [
                {name: 'Claire', city: {zip: '51111'}},
                {name: 'Anna'},
                {name: 'Claire', city: {zip: '41111'}},
                {name: 'Donald', city: 2},
                {name: 'Claire', city: {zip: '11111'}},
                {name: 'Anna', city: {zip: '21111'}}
            ];
            angularDatatable.ngOnChanges({inputData: new SimpleChange(angularDatatable.inputData, newData, true)});
            angularDatatable.setSort('city.zip', 'asc');
            angularDatatable.ngDoCheck();

            expect(angularDatatable.data).toEqual([
                {name: 'Claire', city: {zip: '11111'}},
                {name: 'Anna', city: {zip: '21111'}},
                {name: 'Claire', city: {zip: '41111'}},
                {name: 'Claire', city: {zip: '51111'}},
                {name: 'Anna'},
                {name: 'Donald', city: 2},
            ]);
        });
    });

    describe('data change', () => {
        it('should refresh data when inputData change', () => {
            const newData = [{id: 5, name: 'Ðrone'}, {id: 4, name: 'Ananas'}];
            angularDatatable.ngOnChanges({inputData: new SimpleChange(angularDatatable.inputData, newData, true)});
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual([{id: 5, name: 'Ðrone'}, {id: 4, name: 'Ananas'}]);
        });

        it('should refresh data when rows removed from inputData', () => {
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual(angularDatatable.inputData);
            angularDatatable.inputData.pop();
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual(angularDatatable.inputData);
        });

        it('should refresh data when rows added to inputData', () => {
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual(angularDatatable.inputData);
            angularDatatable.inputData.push({id: 6, name: 'Furby'});
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual(angularDatatable.inputData);
        });

        it('should fire onPageChange event after inputData change', (done) => {
            angularDatatable.setPage(2, 2);
            angularDatatable.ngDoCheck();

            angularDatatable.onPageChange.subscribe((opt: PageEvent) => {
                expect(opt.activePage).toEqual(1);
                expect(opt.dataLength).toEqual(2);
                expect(opt.rowsOnPage).toEqual(2);
                done();
            });
            const newData = [{id: 5, name: 'Ðrone'}, {id: 4, name: 'Ananas'}];
            angularDatatable.ngOnChanges({inputData: new SimpleChange(angularDatatable.inputData, newData, true)});
            angularDatatable.ngDoCheck();
        });

        it('should fire onPageChange event after rows added', (done) => {
            angularDatatable.setPage(2, 2);
            angularDatatable.ngDoCheck();

            angularDatatable.onPageChange.subscribe((opt: PageEvent) => {
                expect(opt.activePage).toEqual(2);
                expect(opt.dataLength).toEqual(6);
                expect(opt.rowsOnPage).toEqual(2);
                done();
            });
            angularDatatable.inputData.push({id: 6, name: 'Furby'});
            angularDatatable.ngDoCheck();
        });

        it('should fire onPageChange event after rows removed', (done) => {
            angularDatatable.setPage(2, 2);
            angularDatatable.ngDoCheck();

            angularDatatable.onPageChange.subscribe((opt: PageEvent) => {
                expect(opt.activePage).toEqual(1);
                expect(opt.dataLength).toEqual(2);
                expect(opt.rowsOnPage).toEqual(2);
                done();
            });
            _.times(3, () => angularDatatable.inputData.pop());
            angularDatatable.ngDoCheck();
        });

        it('should change page when no data on current page after changed inputData', () => {
            angularDatatable.setPage(2, 2);
            angularDatatable.ngDoCheck();

            const newData = [{id: 5, name: 'Ðrone'}, {id: 4, name: 'Ananas'}];
            angularDatatable.ngOnChanges({inputData: new SimpleChange(angularDatatable.inputData, newData, true)});
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual(newData);
        });

        it('should change page when no data on current page after rows removed', () => {
            angularDatatable.setPage(2, 2);
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual([{id: 2, name: 'ącki'}, {id: 5, name: 'Ðrone'}]);

            angularDatatable.inputData.pop();
            angularDatatable.inputData.pop();
            angularDatatable.inputData.pop();
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual([{id: 3, name: 'banana'}, {id: 1, name: 'Duck'}]);
        });

        it('shouldn\'t change page when can display data after data changed', () => {
            angularDatatable.setPage(2, 1);
            angularDatatable.ngDoCheck();

            const newData = [{id: 5, name: 'Ðrone'}, {id: 1, name: 'Duck'}, {id: 4, name: 'Ananas'}];
            angularDatatable.ngOnChanges({inputData: new SimpleChange(angularDatatable.inputData, newData, true)});
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual([{id: 1, name: 'Duck'}]);
        });

        it('shouldn\'t change page when can display data after rows removed', () => {
            angularDatatable.setPage(2, 1);
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual([{id: 1, name: 'Duck'}]);

            angularDatatable.inputData.pop();
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual([{id: 1, name: 'Duck'}]);
        });

        it('shouldn\'t change page when can display data after rows added', () => {
            angularDatatable.setPage(2, 1);
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual([{id: 1, name: 'Duck'}]);

            angularDatatable.inputData.push({id: 6, name: 'Furby'});
            angularDatatable.ngDoCheck();
            expect(angularDatatable.data).toEqual([{id: 1, name: 'Duck'}]);
        });

        it('shouldn\'t change page to 0 when data is empty', () => {
            angularDatatable.setPage(2, 1);
            angularDatatable.ngDoCheck();

            const newData = [];
            angularDatatable.ngOnChanges({inputData: new SimpleChange(angularDatatable.inputData, newData, true)});
            angularDatatable.ngDoCheck();
            expect(angularDatatable.activePage).toEqual(1);
        });

        it('shouldn\'t change page to 0 when data is empty after removed rows', () => {
            angularDatatable.setPage(2, 1);
            angularDatatable.ngDoCheck();

            _.times(5, () => angularDatatable.inputData.pop());
            angularDatatable.ngDoCheck();
            expect(angularDatatable.inputData.length).toEqual(0);
            expect(angularDatatable.activePage).toEqual(1);
        });
    });
});
