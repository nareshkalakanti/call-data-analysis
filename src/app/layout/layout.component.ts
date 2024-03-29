import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as Papa from 'papaparse';
import { Router } from '@angular/router';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  public fileErrorMessage!: string | null;
  public isLoading = false;
  public selectedRowIndex: number[] = [];
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
  public tempData: any[] = [];
  public newTableData: any[] = [];
  public displayData: any[] = [];
  public subscription: Array<Subscription> = [];

  constructor(private router: Router) {

  }

  ngOnInit(): void {
    this.fileForm.valueChanges.subscribe(() => {
      this.selectedHeader = this.fileForm.controls['columnHeader'].value!;
      this.searchQuery = this.fileForm.controls['searchQuery'].value!;
      this.filterData();
    });
    this.fileForm.controls['rowIndex'].valueChanges.subscribe(() => {
      this.rowIndexChanged();
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
          id: index,
          data: obj
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
  // parseCSV(contents: string) {
  //   if (contents) {
  //     const lines = contents.split('\n');
  //     this.headers = lines[0].split(',').map(header => header.trim());
  //     // Not working in large data
  //     // ------------------------------
  //     const data = lines.slice(1).map((line, index) => {
  //       const values = line.split(',');
  //       const rowData: any = {};
  //       this.headers.forEach((header, index) => {
  //         rowData[header] = values[index] && values[index].trim();
  //       });
  //       // return { id: index, data: rowData };
  //       return rowData
  //     });
  //     // ------------------------------

  //     if (this.headers.length > 0) {
  //       this.fileForm.patchValue({
  //         columnHeader: this.headers[0]
  //       })
  //     }
  //     // this.fileData = data;
  //     this.fileData = data.map((obj, index) => ({
  //       id: index,
  //       data: obj
  //     }));
  //     this.filterData();
  //   }
  // }
  removeFiles(): void {
    this.fileErrorMessage = null;
    this.fileData = [];
    this.headers = [];
    this.files = [];
    this.displayData = [];
    this.fileForm.reset();
    this.removeAllIndex();
    this.selectedHeader = '';
    this.selectedRowIndex = [];
  }
  onSelectChange(): void {
    this.filterData();
  }
  filterData() {
    if (this.selectedHeader && this.searchQuery) {
      this.displayData = this.fileData.filter(item => {
        const cellValue = item.data[this.selectedHeader] && item.data[this.selectedHeader].toString().toLowerCase();
        return cellValue && cellValue.includes(this.searchQuery.toLowerCase());
      });
    } else {
      this.displayData = this.fileData;
      console.log("Display => ", this.displayData);
    }
  }
  rowIndexChanged(): void {
    this.selectedRowIndex.push(this.fileForm.controls['rowIndex'].value);
    console.log("Row index array", this.selectedRowIndex);
    this.filterNewTableData(this.selectedRowIndex);
  }
  removeRowIndex(index: number): void {
    this.selectedRowIndex.splice(index, 1);
    this.filterNewTableData(this.selectedRowIndex);
  }
  removeAllIndex(): void {
    this.selectedRowIndex = [];
    this.filterNewTableData(this.selectedRowIndex);
  }
  filterNewTableData(indices: number[]): void {
    if (!indices || indices.length === 0) {
      this.newTableData = [];
      return;
    }
    this.newTableData = this.fileData.filter(obj => indices.includes(obj.id.toString()));
  }
  logoutUser(): void {
    this.router.navigate(['/login']);
  }
  ngOnDestroy(): void {
    this.subscription.forEach(i => i.unsubscribe());
    this.removeFiles();
  }


}
