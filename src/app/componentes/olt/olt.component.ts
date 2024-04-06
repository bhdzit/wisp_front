import { Component, OnInit, ViewChild } from '@angular/core';
import { OLTSService } from 'src/app/services/olts.services';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OltInfoComponent } from './olt-info/olt-info.component';

export interface OltVO {
  id?: number;
  nombre?: string,
  lat?: string,
  lng?: string,
}


@Component({
  selector: 'app-olt',
  templateUrl: './olt.component.html',
  styleUrls: ['./olt.component.css']
})


export class OltComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['position', 'name', 'opciones'];
  dataSource: MatTableDataSource<OltVO> = new MatTableDataSource();

  filtradoTxt:string="";

  constructor(private _oltsService:OLTSService, public _dialog: MatDialog) { }

  ngOnInit(): void {
    this._oltsService.getOlts().subscribe(then => {
      this.dataSource.data = then;
      this.dataSource.paginator = this.paginator;
    });

  }
  agregarTorre() {
    const dialogRef = this._dialog.open(OltInfoComponent, {
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

  editarOlts(oltVO: OltVO) {
    const dialogRef = this._dialog.open(OltInfoComponent, {
      width: '50vw', enterAnimationDuration: "1000ms",
      data: oltVO
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && "data" in result) {
        this.dataSource.data = result.data;
      }
    });
  }

  eliminarTorre(oltVO: OltVO) {
    this._oltsService.destroyOlts(oltVO).subscribe(
      then => {
        this.dataSource.data = then;
      }
    );
  }

  filtrado(e: KeyboardEvent) {
    this.dataSource.filter = ((e.target as HTMLInputElement).value);
  }

}
