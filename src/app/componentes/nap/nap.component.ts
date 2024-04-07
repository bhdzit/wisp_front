import { Component, ViewChild, HostListener } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, concat } from 'rxjs';
import { PaquetesService } from 'src/app/services/paquetes.service';
import Swal from 'sweetalert2';
import { PaqueteVO } from '../paquetes/paquetes.component';
import { NapInfoComponent } from './nap-info/nap-info.component';
import { NapService } from 'src/app/services/nap.services';
import { MatDialog } from '@angular/material/dialog';

export interface NapVO {
  id?: number;
  color?: string,
  puerto?: string,
  numero?: string,
  olt?:number,
  lat?: string,
  lng?: string,
}

@Component({
  selector: 'app-nap',
  templateUrl: './nap.component.html',
  styleUrls: ['./nap.component.css']
})
export class NapComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['position', 'olt','referencia', 'puerto', 'numero', 'opciones'];
  dataSource: MatTableDataSource<NapVO> = new MatTableDataSource();

  filtradoTxt:string="";

  constructor(private _napService: NapService, public _dialog: MatDialog) { }

  ngOnInit(): void {
    this._napService.getNaps().subscribe(then => {
      this.dataSource.data = then;
      this.dataSource.paginator = this.paginator;
    });

  }
  agregarNap() {
    const dialogRef = this._dialog.open(NapInfoComponent, {
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

  editarNap(nap: NapVO) {
    const dialogRef = this._dialog.open(NapInfoComponent, {
      width: '50vw', enterAnimationDuration: "1000ms",
      data: nap
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && "data" in result) {
        this.dataSource.data = result.data;
      }
    });
  }

  eliminarNap(nap: NapVO) {
    this._napService.destroyNap(nap).subscribe(
      then => {
        this.dataSource.data = then;
      }
    );
  }

  filtrado(e: KeyboardEvent) {
    this.dataSource.filter = ((e.target as HTMLInputElement).value);
  }

}