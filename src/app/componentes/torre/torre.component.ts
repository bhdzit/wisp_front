import { Component, OnInit, ViewChild } from '@angular/core';
import { TorresService } from 'src/app/services/torres.services';
import { MatDialog } from '@angular/material/dialog';
import { TorreInfoComponent } from './torre-info/torre-info.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface TorreVO {
  id?: number;
  nombre?: string,
  altura?: number,
  lat?: string,
  lng?: string,
}


@Component({
  selector: 'app-torre',
  templateUrl: './torre.component.html',
  styleUrls: ['./torre.component.css']
})


export class TorreComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'opciones'];
  dataSource: MatTableDataSource<TorreVO> = new MatTableDataSource([{}]);

  filtradoTxt:string="";

  constructor(private _torresService: TorresService, public _dialog: MatDialog) { }

  ngOnInit(): void {
    this._torresService.getTorres().subscribe(then => {
      this.dataSource.data = then;
      this.dataSource.paginator = this.paginator;
    });

  }
  agregarTorre() {
    const dialogRef = this._dialog.open(TorreInfoComponent, {
      width: '50vw', enterAnimationDuration: "1000ms"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && "data" in result) {
        this.dataSource.data = result.data;

        setTimeout(() => {
          this.dataSource.paginator?.lastPage();
        }, 1000);


      }
    });
  }

  editarTorre(torre: TorreVO) {
    const dialogRef = this._dialog.open(TorreInfoComponent, {
      width: '50vw', enterAnimationDuration: "1000ms",
      data: torre
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && "data" in result) {
        this.dataSource.data = result.data;
      }
    });
  }

  eliminarTorre(torre: TorreVO) {
    this._torresService.destroyTorres(torre).subscribe(
      then => {
        this.dataSource.data = then;
      }
    );
  }

  filtrado(e: KeyboardEvent) {
    this.dataSource.filter = ((e.target as HTMLInputElement).value);
  }

}
