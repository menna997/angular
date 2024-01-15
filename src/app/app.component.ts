import { Component, OnInit ,AfterViewInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { FormGroup,FormBuilder ,Validators } from '@angular/forms';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'my-first-project';
  listForm!: FormGroup
  displayedColumns: string[] = ['titleForm', 'authorForm', 'yearForm','action'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(public dialog: MatDialog, private formBuilder: FormBuilder,private api:ApiService) { }
 
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogComponent, {
      width: '250px',

    });
  }
  ngOnInit(): void {
    this.getAllProducts();
    this.listForm = this.formBuilder.group({
      titleForm: ['', Validators.required],
      authorForm: ['', Validators.required],
      yearForm: ['', Validators.required],  
    })
  }
  addBook() {
    console.log(this.listForm.value);
    if (this.listForm.valid) {
      this.api.postBook(this.listForm.value)
        .subscribe({
          next: (res) => {
            alert("book added successfully")
            this.listForm.reset();
          },
          error:()=>{
            alert("Error while adding the book")
          }
      })
    }
  }
  getAllProducts() {
    this.api.getBook()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error:(err)=>{
          alert("Error while adding the book")
        }
    })
  }
  deleteProduct(id:number) {
    this.api.deleteProduct(id)
    .subscribe({
      next: (res) => {
        alert ("Book Deleted Successfully")
      },
      error:()=>{
        alert("Error while deleting the book!!")
      }
  })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
