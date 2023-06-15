import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { ClienteVO } from '../clientes.component';
import { PaquetesService } from 'src/app/services/paquetes.service';
import { PaqueteVO } from '../../paquetes/paquetes.component';
import { map } from 'rxjs/operators';
import { concat } from 'rxjs';
import { SectorsService } from 'src/app/services/sectores.services';
import { SectorVO } from '../../sector/sector.component';
import { ClientesService } from 'src/app/services/clientes.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MapViewComponent } from 'src/app/shared-componentes/map-view.component';
import { TorresService } from 'src/app/services/torres.services';
import { TorreVO } from '../../torre/torre.component';
@Component({
  selector: 'app-clientes-info',
  templateUrl: './clientes-info.component.html',
  styleUrls: ['./clientes-info.component.css']
})
export class ClientesInfoComponent implements OnInit, AfterViewInit {

  submitErrorMsg: any = {};
  clienteVO: ClienteVO = {
    torre: null,
    paquete: null,
    primer_pago: null,
    nueva: false,
    editada: false,
    contrato:null
  };

  paquetesArr: PaqueteVO[] = [];
  torreArr: TorreVO[] = [];

  @ViewChild(MapViewComponent) _mapComponent: MapViewComponent | undefined;

  constructor(public dialog: MatDialogRef<ClientesInfoComponent>, @Inject(MAT_DIALOG_DATA) public data: ClienteVO, private _paquetesService: PaquetesService,  private _clientesService: ClientesService,private _torresService:TorresService) { }
  ngAfterViewInit(): void {
    if (this.data != null)
      this._mapComponent?.addOnTapMarck({ lat: this.data.lat, lng: this.data.lng })

  }

  ngOnInit(): void {
    let listaDeServicios = [];

    let serviciosPaquetes = this._paquetesService.getpaquetes().pipe(map((then) => {
      this.paquetesArr = then;
    }));

    let sectorsService = this._torresService.getTorres().pipe(map((then) => {
      this.torreArr = then;
    }));


    listaDeServicios.push(serviciosPaquetes);
    listaDeServicios.push(sectorsService);

    concat(...listaDeServicios).subscribe(
      res => console.log("next", res),
      err => console.log("error", err),
      () => {

        console.log("complete")
      }
    );

    this.clienteVO = this.data || {
      torre: null,
      paquete: null,
      primer_pago: null,
      nueva: false,
      editada: false,
      contrato:null
    };


  }

  coordsChangeEvent(evt: any) {
    console.log(evt);
    this.clienteVO.lat = evt.lat + "";
    this.clienteVO.lng = evt.lng + "";
  }

  guardarCliente() {
    if (this.clienteVO.id == undefined) {
      this._clientesService.saveClientes(this.clienteVO).subscribe(then => {
        if ("errors" in then) {
          this.submitErrorMsg = then.errors;
          console.log(this.submitErrorMsg);
        }
        else
          this.dialog.close({ data: then });
      });
    }
    else {
      this._clientesService.updateCliente(this.clienteVO).subscribe(then => {
        if ("errors" in then) {
          this.submitErrorMsg = then.errors;
          console.log(this.submitErrorMsg);
        }
        else
          this.dialog.close({ data: then });
      });
    }
  }

  formatoTel(event: KeyboardEvent) {

    let { key } = event;
    console.log(key);
    if (key == "Backspace" || key == "ArrowLeft" || key == "ArrowRight") return true;

    let input = event.target as HTMLInputElement;
    if (input.value.length == 0) {
      input.value = "(" + key + ")";
      input.setSelectionRange(2, 2);
      return false;
    }

    return !(Number.isNaN(Number(key)));
    //input.value += key;
  }

}
