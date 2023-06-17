import { Component, OnInit } from '@angular/core';
import { TorreVO } from 'src/app/componentes/torre/torre.component';
import { TorresService } from 'src/app/services/torres.services';
import { map, filter, tap } from 'rxjs/operators';
import { Observable, concat } from 'rxjs';
import { SectorVO } from 'src/app/componentes/sector/sector.component';
import { PaqueteVO } from 'src/app/componentes/paquetes/paquetes.component';
import { SectorsService } from 'src/app/services/sectores.services';
import { PaquetesService } from 'src/app/services/paquetes.service';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})
export class FiltroComponent implements OnInit {
  constructor(private _torresService: TorresService,
    private _sectorsService: SectorsService,
    private _paquetes: PaquetesService,
    private dialog: MatDialogRef<FiltroComponent>) { }

  sectores: SectorVO & { [value: string]: any }[] = [];

  paquetes: PaqueteVO & { [value: string]: any }[] = [];

  torres: TorreVO & { [value: string]: any }[] = [];

  listaDeServicios: Observable<any>[] = [];

  ngOnInit(): void {

    this.listaDeServicios.push(this._torresService.getTorres().pipe(map((val) => this.torres = val)));
    // this.listaDeServicios.push(this._sectorsService.getSectors().pipe(map((val) => this.sectores = val)));
    // this.listaDeServicios.push(this._paquetes.getpaquetes().pipe(map((val) => this.paquetes = val)));

    concat(...this.listaDeServicios).subscribe(
      res => console.log("next", res),
      err => console.log("error", err),
      () => {

        console.log("complete")
      }
    );

  }

  aplicarFiltro() {
    let listaDeFiltroTorres = this.torres.filter(item => item['value'] == true);
    listaDeFiltroTorres.map(item => {
      item["tipoDeFiltro"] = "torre";
      item["name"] = item["nombre"];
    });

    // let listaDeFiltroSector = this.sectores.filter(item => item['value'] == true);
    // listaDeFiltroSector.map(item => {
    //   item["tipoDeFiltro"] = "sector";
    // });

    // let listaDeFiltroPaquetes = this.paquetes.filter(item => item['value'] == true);
    // listaDeFiltroPaquetes.map(item => {
    //   item["tipoDeFiltro"] = "paquete";
    // });
    let listaDeFiltro = [...listaDeFiltroTorres];

    this.dialog.close({ data: listaDeFiltro });
  }

  setAll(event: Event) {
    const ischecked = (<HTMLInputElement>event.target).checked
    console.log(ischecked);
    this.torres.map(item => item['value'] = ischecked);
  }


}
