import { Component, OnInit } from '@angular/core';
import { TorresService } from 'src/app/services/torres.services';
import { MatDialog } from '@angular/material/dialog';
import { TorreInfoComponent } from './torre-info/torre-info.component';

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

  constructor(private _torresService: TorresService, public _dialog: MatDialog) { }

  ngOnInit(): void {
    this._torresService.getTorres().subscribe(then => {
      this.dataSource = then;

    });

  }


  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'opciones'];
  dataSource: TorreVO[] = [];


  agregarTorre() {
    const dialogRef = this._dialog.open(TorreInfoComponent, {
      width: '50vw', enterAnimationDuration: "1000ms"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && "data" in result) {
        this.dataSource = result.data;
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
        this.dataSource = result.data;
      }
    });
  }

  eliminarTorre(torre: TorreVO) {
    this._torresService.destroyTorres(torre).subscribe(
      then => {
        this.dataSource = then;
      }
    );
  }

}
