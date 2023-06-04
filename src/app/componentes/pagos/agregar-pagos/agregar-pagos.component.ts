import { Component, OnInit } from '@angular/core';
import { ClienteVO } from '../../clientes/clientes.component';
import { ClientesService } from 'src/app/services/clientes.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PaqueteVO } from '../../paquetes/paquetes.component';
import { PaquetesService } from 'src/app/services/paquetes.service';
import { PagosService } from 'src/app/services/pagos.services';
import Swal from 'sweetalert2';

export interface PagoVO {
  id?: number;
  paquete: number;
  costo?: string;
  referencia?: string;
  cliente: ClienteVO;
  mesPagado: string;
  estatus?: boolean;
  esReferencia?: boolean;
  Cliente?: ClienteVO;
}



@Component({
  selector: 'app-agregar-pagos',
  templateUrl: './agregar-pagos.component.html',
  styleUrls: ['./agregar-pagos.component.css']
})
export class AgregarPagosComponent implements OnInit {
  listaDeClientes: ClienteVO[] = [];
  listaDePagos: PagoVO[] = [];
  clienteSelecionado: any = null;
  clienteCtrl = new FormControl('');
  listaDePaquetes: PaqueteVO[] = [];

  filteredCliente?: Observable<ClienteVO[]>;
  totalEnPagos: number = 0;
  ultimoPago: Date | null = null;
  ultimoPagoStr?: string = "";
  mostrarReferencia: boolean = false;

  constructor(private _clientesService: ClientesService, private _paquetesService: PaquetesService, private _pagosService: PagosService) {

  }
  ngOnInit(): void {
    this._clientesService.getClientes().subscribe(
      then => {
        this.listaDeClientes = then;
        this.filteredCliente = this.clienteCtrl.valueChanges.pipe(
          startWith(''),
          map(state => (state ? this._filterClientes(state) : this.listaDeClientes.slice())),
        );
      }
    );

    this._paquetesService.getpaquetes().subscribe(
      then => {
        this.listaDePaquetes = then;
      });
  }

  seSelecionoCliente(e: MatAutocompleteSelectedEvent) {
    this.clienteSelecionado = this.listaDeClientes.filter(cliente => (cliente?.id + "") == e.option.id)[0];
    this.listaDePagos = [];
    this.agregarPagoNuevo();
    this.getPagosDeCliente();
  }

  getPagosDeCliente() {
    this._pagosService.getPagosDeCliente({ cliente: this.clienteSelecionado.id }).subscribe(then => {
      if (then.length == 0) {
        this.ultimoPagoStr = "Aun no ha se ha hecho ninguna pago".toUpperCase()
        return;
      }
      then.map(pago => {
        let mes = Number(pago.mesPagado.split("-")[1]) - 1;
        let anio = Number(pago.mesPagado.split("-")[0]);
        let fechaDePago = new Date(anio, mes)
        if (this.ultimoPago == null || fechaDePago > this.ultimoPago) this.ultimoPago = fechaDePago;
        console.log(pago.mesPagado, new Date(anio, mes))
      })
      this.ultimoPagoStr = "El ultimo pago fue " + this.ultimoPago?.toLocaleDateString();
      this.ultimoPagoStr = this.ultimoPagoStr.toUpperCase();
      console.log(this.ultimoPago);
    });
  }

  inicializarPago(): PagoVO {
    let pago: PagoVO = {
      paquete: this.clienteSelecionado.paquete,
      cliente: this.clienteSelecionado,
      mesPagado: this.generarMesDePago(),
      costo: this.listaDePaquetes.filter(paqute => paqute.id == this.clienteSelecionado.paqueteVO.id)[0].precio,
      esReferencia: false
    };
    return pago;
  }

  generarMesDePago(): string {
    if (this.listaDePagos.length == 0) {
      let fecha = new Date();
      return fecha.getFullYear() + "-" + ("00" + (fecha.getMonth() + 1)).slice(-2);
    }
    let ultimoMesPagado = this.listaDePagos[this.listaDePagos.length - 1].mesPagado;
    let fecha = new Date();
    fecha.setFullYear(Number(ultimoMesPagado.split("-")[0]));
    fecha.setMonth(Number(ultimoMesPagado.split("-")[1]));
    return fecha.getFullYear() + "-" + ("00" + (fecha.getMonth() + 1)).slice(-2);
  }

  agregarPagoNuevo() {
    this.listaDePagos.push(this.inicializarPago());
    this.actualizarTotal();
  }

  private _filterClientes(value: string): ClienteVO[] {
    const filterValue = value.toLowerCase();

    return this.listaDeClientes.filter(cliente => cliente?.cliente?.toLowerCase().includes(filterValue));
  }

  cambioDePaquete(evt: Event, pagoSelecionado: PagoVO) {
    pagoSelecionado.costo = this.listaDePaquetes.filter(paqute => paqute.id == pagoSelecionado.paquete)[0].precio;
    this.actualizarTotal();
  }

  eliminarPago(index: number) {
    this.listaDePagos = this.listaDePagos.filter((pago, i) => index != i);
    this.actualizarTotal();
  }

  actualizarTotal() {
    let initialValue = 0;
    this.totalEnPagos = this.listaDePagos.reduce(
      (accumulator, pago) => accumulator + Number(pago.costo),
      initialValue
    );
  }

  realizarPago() {
    if (!this.exitePagoConMetodoReferencia()) {
      this._pagosService.realizarPagos(this.listaDePagos).subscribe(then => {
        this.mostrarMsj('El pago se realizo con exito!');
        this.listaDePagos = [];
        this.clienteSelecionado = null;
      });
    }
    else {
      this.mostrarMsj('Parece que no se ha validado La referencia!');
    }
  }

  mostrarMsj(msj: string) {
    Swal.fire({
      icon: "info",
      text: msj,
      confirmButtonText: 'OK'
    })
  }

  exitePagoConMetodoReferencia(): boolean {
    let pagosConReferencia = this.listaDePagos.filter(pago => pago.esReferencia && pago.referencia == undefined);
    return pagosConReferencia.length > 0
  }

  async validarReferencia() {
    const { value: referencia } = await Swal.fire({
      title: 'Validar referencia',
      input: 'text',
      inputLabel: 'Ingrese referencia',
      inputPlaceholder: 'Referencia'
    })

    if (referencia) {
      this._pagosService.validarReferencia(referencia).subscribe(async (then) => {
        console.log(then);
        let titulo = "Se contraron coincidencias en la referencia: `" + referencia + "`";
        let html = "";
        if (then.esRefereciaValida) {
          titulo = "La Referencia " + referencia + " es Valida"
          //return res.isConfirmed
        }
        else {
          then.coincidencia.map((item: PagoVO) => {
            html += "Referencia:" + item.referencia + ", Cliente:" + item.Cliente?.cliente + ", Mes:" + item.mesPagado + "<br>";
          });
        }
        let res = await Swal.fire({
          title: titulo,
          text: "¿Deseas asignar la referencia al pago ",
          html: html,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cerrar',
          confirmButtonText: 'Si, agregar!'
        });
        if (res.isConfirmed) {
          this.listaDePagos.map(pago => {
            pago.referencia = referencia;
          });
        }

      });
    }

  }


}
