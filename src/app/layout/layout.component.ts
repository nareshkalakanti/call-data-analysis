import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as Papa from 'papaparse';
import { Router } from '@angular/router';
import { NgbModal } from '../shared/ng-modal';
import { ContentPriviewComponent } from '../shared/content-priview/content-priview.component';
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
    rowIndex: new FormControl<any>('', []),
  });

  public files: any[] = []
  public headers: any[] = [];
  public fileData: any[] = [];
  public displayData: any[] = [];
  public selectAll = false;
  public subscription: Array<Subscription> = [];

  constructor(private router: Router , private modalService:NgbModal) {

  }

  ngOnInit(): void {
    this.fileForm.valueChanges.subscribe(() => {
      this.selectedHeader = this.fileForm.controls['columnHeader'].value!;
      this.searchQuery = this.fileForm.controls['searchQuery'].value!;
      this.filterData();
    });
    this.fileForm.controls['rowIndex'].valueChanges.subscribe(() => {
      // this.rowIndexChanged();
    })
  }
  // onFileChange(event: any): void {
  //   this.files = event.target.files;
  //   const file = this.files[0];
  //   if (!file.type.includes('text/csv')) {
  //     this.fileErrorMessage = 'Please select CSV file!';
  //     return
  //   }

  //   const reader = new FileReader();
  //   reader.onload = (e: any) => {
  //     const contents = e.target.result;
  //     this.parseCSV(contents);
  //   };

  //   reader.readAsText(file);
  // }
  onFileChange(event: any): void {
    this.files = event.target.files;
    const file = this.files[0];
    if (!file) {
      return
    }
    if (!file.type.includes('text/csv')) {
      this.fileErrorMessage = 'Please select CSV file!';
      return
    }
    this.isLoading = true;
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (result: any) => {
        this.isLoading = false;
        this.headers = result.meta.fields;
        this.fileData = result.data.map((obj: any, index: any) => ({
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
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        this.isLoading = false;
      }
    });
  }

  removeFiles(): void {
    this.fileErrorMessage = null;
    this.fileData = [];
    this.headers = [];
    this.files = [];
    this.displayData = [];
    this.fileForm.reset();
    this.selectedItems = [];
    // this.removeAllIndex();
    this.selectedHeader = '';
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
      console.log("Display => ", this.displayData);
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
  openModal(title:string,content:string){
    if(!this.modalService.hasOpenModals()){
      const modalRef = this.modalService.open(ContentPriviewComponent);
      modalRef.componentInstance.title = title;
      modalRef.componentInstance.content = content;
    }
  }
  logoutUser(): void {
    this.router.navigate(['/login']);
  }
  ngOnDestroy(): void {
    this.subscription.forEach(i => i.unsubscribe());
    this.removeFiles();
  }
}
