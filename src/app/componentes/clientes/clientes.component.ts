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
import { TorreVO } from '../torre/torre.component';
import { PaqueteVO } from '../paquetes/paquetes.component';
import { Sort } from '@angular/material/sort';

export interface ClienteVO {
  id?: number | null;
  cliente?: string;
  paquete?: number | null;
  torre: number | null;
  tel1?: string;
  tel2?: string;
  fechaPago?: Date;
  lat?: string;
  lng?: string;
  primer_pago?: string | null;
  nueva: boolean;
  editada: boolean;
  torresVO?: TorreVO | null;
  paqueteVO?: PaqueteVO | null;
  contrato?: boolean | null,
  estatus?: boolean | null,
  tipoConexion:number|null
  servicioExtra:boolean|null,
  password?:string,
  usuario?:string,
  olt?:number | null,
  nap?:number | null
}

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'torre', 'paquete', 'opciones'];
  dataSource: MatTableDataSource<ClienteVO> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filtradoTxt: string = "";
  suspendidosCheck: boolean = false;
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

  async supenderCliente(cliente: ClienteVO) {
    let res = await Swal.fire({
      title: '¿Estas Seguro?',
      text: "Este cleinte ya no aparecera en la lista de clientes!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, Suspender!'
    });

    console.log(res);


    // you logic goes here, whatever that may be 
    // and it must return either True or False

    if (res.isConfirmed) {
      this._clientesService.suspenderCliente(cliente).subscribe(
        then => {
          this.dataSource.data = then;
        }
      );
    }

  }

  activarCliente(cliente: ClienteVO) {
    this._clientesService.activarCliente(cliente).subscribe(
      then => {
        this.dataSource.data = then;
      }
    );
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

  filtrado(e: KeyboardEvent) {
    this.dataSource.filter = ((e.target as HTMLInputElement).value);
  }

  getClientesSuspendidos() {
    if (this.suspendidosCheck) {
      this._clientesService.getClientesSuspendidos().subscribe(then => {
        this.dataSource.data = then;
      });
    }
    else {
      this._clientesService.getClientes().subscribe(then => {
        this.dataSource.data = then;
      });
    }
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.cliente, b.cliente, isAsc);
        case 'torre':
          return compare(a.torre, b.torre, isAsc);
        case 'paquete':
          return compare(a.paquete, b.paquete, isAsc);

        default:
          return 0;
      }
    });
  }

}

function compare(a: number | string | null | undefined, b: number | string | null | undefined, isAsc: boolean) {
  if (a == null || b == null) return 0;
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
