import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { ClientesService } from 'src/app/services/clientes.service';
import { PagosService } from 'src/app/services/pagos.services';
import { FiltroComponent } from 'src/app/shared-componentes/filtro/filtro.component';
import { PagoVO } from '../agregar-pagos/agregar-pagos.component';
import { ClienteVO } from '../../clientes/clientes.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

export interface PagoDetalle extends ClienteVO {
  pago?: PagoVO;
}

@Component({
  selector: 'app-pagos-mes',
  templateUrl: './pagos-mes.component.html',
  styleUrls: ['./pagos-mes.component.css']
})
export class PagosMesComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'mesPagado', 'fechaDePago', 'torre', 'opciones'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  listaFiltro: any[] = [];
  mesSelecionado: string = "";
  listaDePagos: PagoVO[] = [];
  listaDeClientes: PagoDetalle[] = [];
  listaDeClientesBkp: PagoDetalle[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  sortedData: PagoDetalle[] = [];
  filtroEnPagos: number = 1;
  total: number = 0;

  constructor(public _dialog: MatDialog, private _pagosService: PagosService, private _clientesService: ClientesService, private _liveAnnouncer: LiveAnnouncer) { }

  @ViewChild(MatSort) sort!: MatSort;



  ngOnInit(): void {
    this.mesSelecionado = new Date().getFullYear() + "-" + ("00" + (new Date().getMonth() + 1)).slice(-2);
    this._pagosService.getPagosDelMes(this.mesSelecionado).subscribe(then => {
      this.listaDePagos = then;
      this._clientesService.getClientes().subscribe(then => {
        this.listaDeClientes = then;
        this.organizarDatos();
      });

    });


  }

  seCambioFecha() {
    this._pagosService.getPagosDelMes(this.mesSelecionado).subscribe(then => {
      this.listaDePagos = then;
    });
    this._clientesService.getClientes().subscribe(then => {
      this.listaDeClientes = then;
      this.organizarDatos();
      this.filtroEnPagos = 1;
    });

  }

  organizarDatos() {
    this.listaDePagos.map(pago => {
      let cliente = this.listaDeClientes.filter(cliente => cliente.id == pago.cliente)[0];

      cliente.pago = pago;

    })
    this.dataSource = new MatTableDataSource(this.listaDeClientes);
    this.listaDeClientesBkp = [...JSON.parse(JSON.stringify(this.listaDeClientes))];
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getTotal();
  }



  mostrarFiltrado() {
    const dialogRef = this._dialog.open(FiltroComponent, {
      width: '20vw', enterAnimationDuration: "1000ms"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && "data" in result) {
        this.listaFiltro = result.data;
        this.aplicarFiltro();
      }
    });
  }

  eliminarFiltro(filtro: any) {
    this.listaFiltro = this.listaFiltro.filter(item => filtro != item);
    this.aplicarFiltro();
  }
  formatoMesPagado(pago: PagoVO) {
    if (pago == undefined) return "";
    let mesPagado = pago.mesPagado.split("-");
    return mesPagado[1] + "-" + mesPagado[0];
  }

  formatoFechaDePago(fechaStr: Date) {
    if (fechaStr == undefined) return "N\\A";
    let fecha = new Date(fechaStr);
    return fecha.toLocaleDateString();

  }
  filtrado(e: KeyboardEvent) {
    this.dataSource.filter = ((e.target as HTMLInputElement).value);
  }


  aplicarFiltro() {
    let torres = this.listaFiltro.filter(item => item.tipoDeFiltro == "torre");
    let data = this.listaDeClientesBkp.filter(cliente => torres.some(torre => torre.id == cliente?.torresVO?.id) || torres.length == 0);

    if (this.filtroEnPagos == 2)
      data = data.filter(cliente => cliente.pago == undefined);
    if (this.filtroEnPagos == 3)
      data = data.filter(cliente => cliente?.pago?.costo != null && Number(cliente?.pago?.costo) == 0);
    if (this.filtroEnPagos == 4)
      data = data.filter(cliente => cliente.pago != undefined);
    if (this.filtroEnPagos == 5)
      data = data.filter(cliente => cliente.pago != undefined && cliente.pago.referencia == null);
    if (this.filtroEnPagos == 6)
      data = data.filter(cliente => cliente.pago != undefined && cliente.pago.referencia != null);
    // let sectores = this.listaFiltro.filter(item => item.tipoDeFiltro == "sector");
    // data = data.filter(cliente => sectores.some(sector => sector.id == cliente?.torre) || sectores.length == 0);

    // let paquetes = this.listaFiltro.filter(item => item.tipoDeFiltro == "paquete");
    // data = data.filter(cliente => paquetes.some(pkg => pkg.id == cliente?.paquete) || paquetes.length == 0);
    // console.log(paquetes);

    this.dataSource.data = data;

    this.getTotal();

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
        case 'mesPagado':

          return compare(this.getTipoPago(a.pago), this.getTipoPago(b.pago), isAsc);
        case 'fechaDePago':
          return compare(a.pago?.createdAt, b.pago?.createdAt, isAsc);
        case 'torre':
          return compare(a.torre, b.torre, isAsc);
        case 'protein':
          return compare(a.protein, b.protein, isAsc);
        default:
          return 0;
      }
    });
  }

  imprimerPago(id: number) {
    this._pagosService.generarPDF(id).subscribe(data => {

      var downloadURL = window.URL.createObjectURL(data);
      window.open(downloadURL, '_blank', 'width=1000, height=800');

    });
  }

  getTipoPago(pago: PagoVO): number {
    if (pago == undefined) return 0;
    if (pago?.referencia == null) return 1;
    return 2;
  }

  quitarFila(element: ClienteVO) {
    this.dataSource.data = this.dataSource.data.filter(item => element != item);
  }

  eliminarFila(element: PagoDetalle) {
    if (element.pago != undefined)
      this._pagosService.eliminarPago(element?.pago).subscribe(then => {
        this.quitarFila(element)
      });
  }

  esPagoRequerido(fechaPago: string): boolean {
    let fechaStr = fechaPago.split("-");
    let fechaPrimerpago = new Date(Number(fechaStr[0]), Number(fechaStr[1]) - 1, 1);
    let mesSelecionado = new Date(Number(this.mesSelecionado.split("-")[0]), Number(this.mesSelecionado.split("-")[1]), 1);
    if (fechaPrimerpago > mesSelecionado) return false;
    return true;
  }

  formatoDefecha(pago: string): string {
    let fecha = pago.split("-");
    return fecha[2] + "-" + fecha[1] + "-" + fecha[0];
  }

  getTotal() {

    let pagos = this.dataSource.data.filter(cliente => cliente.pago != undefined);
    this.total = pagos.reduce(
      (accumulator, currentValue: any) => accumulator + (currentValue.pago.costo * 1),
      0,
    );

    pagos.map((pago: any) => {
      console.log(pago);
      this.total += pago.pago?.extraVO.reduce((val1: any, val2: any) => val1 + (val2.costo * 1), 0);
    }
    );

  }



}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
