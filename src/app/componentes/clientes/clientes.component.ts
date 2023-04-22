import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, concat } from 'rxjs';
import { PaquetesService } from 'src/app/services/paquetes.service';
import Swal from 'sweetalert2';

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


  agregarCliente() {
  }

  editarCliente(cliente: ClienteVO) {
  }

  eliminarCliente(cñiente: ClienteVO) {

  }

}
