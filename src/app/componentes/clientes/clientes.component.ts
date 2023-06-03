import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, concat } from 'rxjs';
import { PaquetesService } from 'src/app/services/paquetes.service';
import Swal from 'sweetalert2';
import { ClientesInfoComponent } from './clientes-info/clientes-info.component';
import { ClientesService } from 'src/app/services/clientes.service';
import { SectorVO } from '../sector/sector.component';

export interface ClienteVO {
  id?: number | null;
  cliente?: string;
  usuario?: string;
  paquete?: number | null;
  sector?: number | null;
  tel1?: string;
  tel2?: string;
  fechaPago?: Date;
  lat?: string;
  lng?: string;
  primer_pago?: string | null;
  nueva: boolean;
  editada: boolean;
  sectorVO?: SectorVO | null;
}

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'usuario', 'ubicacion', 'opciones'];
  dataSource: MatTableDataSource<ClienteVO> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _dialog: MatDialog, private _clientesService: ClientesService) { }
  ngOnInit(): void {
    this._clientesService.getClientes().subscribe(then => {
      this.dataSource = new MatTableDataSource(then);
      this.dataSource.paginator = this.paginator;
    });
  }

  agregarCliente() {
    setTimeout(() => {
      this.dataSource.paginator?.lastPage();

    }, 500);
    const dialogRef = this._dialog.open(ClientesInfoComponent, {
      width: '50vw', enterAnimationDuration: "1000ms"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && "data" in result) {
        this.dataSource.data = result.data;
        setTimeout(() => {
          this.dataSource.paginator?.lastPage();

        }, 500);
      }
    });
  }

  editarCliente(cliente: ClienteVO) {
    const dialogRef = this._dialog.open(ClientesInfoComponent, {
      width: '50vw', enterAnimationDuration: "1000ms",
      data: cliente
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && "data" in result) {
        this.dataSource.data = result.data;
      }
    });

  }

  async eliminarCliente(cliente: ClienteVO) {

    let res = await Swal.fire({
      title: '¿Estas Seguro?',
      text: "Esta accion es irreversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, Eliminar!'
    });

    console.log(res);


    // you logic goes here, whatever that may be 
    // and it must return either True or False

    if (res.isConfirmed) {
      this._clientesService.destroyClientes(cliente).subscribe(
        then => {
          this.dataSource.data = then;
        }
      );
    }
  }

}
