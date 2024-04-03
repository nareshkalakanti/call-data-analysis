import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as Papa from 'papaparse';
import { Router } from '@angular/router';
import { NgbModal } from '../shared/ng-modal';
import { ContentPriviewComponent } from '../shared/content-priview/content-priview.component';
import { CustomerCallService } from '../_service/customer-call.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  public selectedItems: any[] = [];
  public fileErrorMessage!: string | null;
  public isLoading = false;
  public selectedHeader!: string;
  public searchQuery!: string;
  public fileForm = new FormGroup({
    file: new FormControl<any>(null, []),
    columnHeader: new FormControl<string | null>('', []),
    searchQuery: new FormControl<string | null>(null, []),
  });

  public files: any[] = []
  public headers: any[] = [];
  public fileData: any[] = [];
  public displayData: any[] = [];
  public selectAll = false;
  public subscription: Array<Subscription> = [];

  constructor(private router: Router , private modalService:NgbModal, private customerCallService:CustomerCallService) {

  }

  ngOnInit(): void {
    this.getJsonData();
    this.fileForm.valueChanges.subscribe(() => {
      this.selectedHeader = this.fileForm.controls['columnHeader'].value!;
      this.searchQuery = this.fileForm.controls['searchQuery'].value!;
      this.filterData();
    });
  }

  onSelectChange(): void {
    this.filterData();
  }
  filterData() {
    if (this.selectedHeader && this.searchQuery) {
      this.displayData = this.fileData.filter(item => {
        const cellValue = item[this.selectedHeader] && item[this.selectedHeader].toString().toLowerCase();
        return cellValue && cellValue.includes(this.searchQuery.toLowerCase());
      });
    } else {
      this.displayData = this.fileData;
    }
  }

  onCheckboxChange(item: any) {
    if (!item.selected) {
      this.selectAll = false; // Uncheck "select all" if any item is deselected
    }
    this.updateSelectedItems();

  }
  selectAllItems(): void {
    this.selectAll = !this.selectAll;
    this.fileData.forEach(item => item.selected = this.selectAll);
    this.updateSelectedItems();
  }
  updateSelectedItems() {
    this.selectedItems = this.fileData.filter(item => item.selected);
  }
  getJsonData():void{
    this.isLoading = true;
    this.customerCallService.getCustomerData().subscribe({
      next:(res)=>{
        this.fileData = res;
        this.headers = this.fileData && Object.keys(this.fileData[0]);
        this.fileData = res.map((obj: any, index: any) => ({
          id: index + 1,
          ...obj
        }));
        // this.fileData = result.data;
        if (this.headers.length > 0) {
          this.fileForm.patchValue({
            columnHeader: this.headers[0]
          })
        }
        this.filterData();
        this.isLoading = false;
      },
      error:(err)=>{
        console.log("Error => ", err);
        this.isLoading = false;
      }
    })
  }
  logoutUser(): void {
    this.router.navigate(['/login']);
  }
  ngOnDestroy(): void {
    this.subscription.forEach(i => i.unsubscribe());
  }
}
