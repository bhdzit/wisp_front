import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, concat } from 'rxjs';
import { PaquetesService } from 'src/app/services/paquetes.service';
import Swal from 'sweetalert2';
import { ClientesInfoComponent } from './clientes-info/clientes-info.component';

export interface ClienteVO {
  nueva: boolean;
  editada: boolean;
}

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {

  displayedColumns: string[] = ['position', 'name', 'usuario', 'ubicacion', 'opciones'];
  dataSource: ClienteVO[] = [];

  constructor(private _dialog: MatDialog){}

  agregarCliente() {
    const dialogRef = this._dialog.open(ClientesInfoComponent, {
      width: '50vw', enterAnimationDuration: "1000ms"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && "data" in result) {
        this.dataSource = result.data;
      }
    });
  }

  editarCliente(cliente: ClienteVO) {
  }

  eliminarCliente(cñiente: ClienteVO) {

  }

}
