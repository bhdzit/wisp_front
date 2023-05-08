import { Component, ViewChild, HostListener } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, concat } from 'rxjs';
import { PaquetesService } from 'src/app/services/paquetes.service';
import Swal from 'sweetalert2';

export interface PaqueteVO {
  name?: string
  tx?:string
  rx?:string
  precio?:string
  descripcion?:string
  nueva?: boolean;
  editada?: boolean;
  errorMsg?: any
}


@Component({
  selector: 'app-paquetes',
  templateUrl: './paquetes.component.html',
  styleUrls: ['./paquetes.component.css']
})
export class PaquetesComponent {
  listaDeCambios: Observable<any>[] = [];
  dataSource: MatTableDataSource<PaqueteVO> = new MatTableDataSource();
  dataSourceBkp: PaqueteVO[] = [];
  submitErrorMsg: any = {};
  displayedColumns: string[] = ['id', 'name', 'tx', 'rx', 'precio', 'observaciones', 'opciones'];
  selectedInput: string = "";
  filasEliminadas: PaqueteVO[] = [];
  filtradoTxt: string = "";

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _paquetesService: PaquetesService) { }
  ngOnInit(): void {
    this._paquetesService.getpaquetes().subscribe(then => {
      this.dataSource = new MatTableDataSource(then);
      this.dataSourceBkp = [...JSON.parse(JSON.stringify(then))];
      this.dataSource.paginator = this.paginator;
    });

  }

  @HostListener('document:keydown.tab', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (this.selectedInput != '') {
      event.preventDefault();

      let target = document.getElementById(this.selectedInput) as HTMLElement;
      let nextTargetID: string | null = target.getAttribute("next-tab-input");
      this.selectedInput = "";
      if (nextTargetID != null) {
        let nextTarget = document.getElementById(nextTargetID) as HTMLInputElement;

        setTimeout(() => {
          if (nextTargetID != null) {
            this.selectedInput = nextTargetID;
            setTimeout(() => {
              nextTarget.focus();
              nextTarget.select();
            }, 200);
          }
        }, 200);
      }
    }

  }

  async canDeactivate() {
    let filasEditadas = this.dataSource.data.filter(item => item.editada && !item.nueva).length;
    let filasNueva = this.dataSource.data.filter(item => item.nueva).length;
    let filasEliminadas = this.filasEliminadas.filter(item => !item.nueva).length;
    if (filasEditadas > 0 || filasNueva > 0 || filasEliminadas > 0) {
      let res = await Swal.fire({
        title: '¿Estas Seguro?',
        text: "Todos los cambios que has hecho no se guardaran!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si, Salir sin Guardar!'
      });

      console.log(res);


      // you logic goes here, whatever that may be 
      // and it must return either True or False

      return res.isConfirmed
    }
    return true;
  }

  descartarClick() {
    this.filtradoTxt = "";
    this.dataSource = new MatTableDataSource([...JSON.parse(JSON.stringify(this.dataSourceBkp))]);
    this.dataSource.paginator = this.paginator;
  }

  filtrado(e: KeyboardEvent) {
    this.dataSource.filter = ((e.target as HTMLInputElement).value);
  }

  agregarSector() {
    this.dataSource.data = [...this.dataSource.data, { nueva: true, editada: false }];
    setTimeout(() => {
      this.dataSource.paginator?.lastPage();

    }, 500);

  }
  saveClick() {
    if (this.validarInputs()) {
      this.dataSource.data.map(item => {
        if (item.editada && !item.nueva) {
          console.log(item, "editada");
          this.listaDeCambios.push(this._paquetesService.updatePaquete(item));
        };
        if (item.nueva) {
          console.log(item, "nueva")
          this.listaDeCambios.push(this._paquetesService.savePaquetes(item));
        };


      });

      this.filasEliminadas.map(item => {
        if (!item.nueva) console.log(item, "eliminada");
        this.listaDeCambios.push(this._paquetesService.destroyPaquetes(item));
      });

      this.saveSectores();
    }
  }
  saveSectores() {
    concat(...this.listaDeCambios).subscribe(
      then => {
        this.dataSource.data = then;
        this.dataSource.paginator = this.paginator;
        this.dataSourceBkp = [...JSON.parse(JSON.stringify(then))];
      },
      err => console.log("error", err),
      () => {
        this.listaDeCambios = [];
        this.filasEliminadas = [];
        console.log("complete")
      }
    );
    // if (this.listaDeCambios.length > 0 && this.listaDeCambios[0]) {
    //   console.log(this.listaDeCambios);
    //   this.listaDeCambios[0].subscribe(then => {
    //     delete this.listaDeCambios[0];
    //     this.saveSectores();
    //     if (!('errors' in then)) {
    //       this.dataSource = then;

    //       this.listaDeCambios = [];
    //       this.filasEliminadas = [];
    //     }
    //   });
    // }
  }

  findTorres() {

  }

  eliminar(element: PaqueteVO) {
    this.filasEliminadas.push({ ...element });
    this.dataSource.data = this.dataSource.data.filter(item => element != item);
  }

  setFocus(e: any) {
    let filaSeleccionada = (e.target as HTMLElement);
    if (filaSeleccionada.tagName == "DIV") {
      setTimeout(() => {
        let input = filaSeleccionada.parentElement?.children[1].children[0] as HTMLInputElement;
        input.focus();
        input.select();
      }, 200);
    }

    if (filaSeleccionada.tagName == "TD") {
      setTimeout(() => {
        let input = filaSeleccionada.children[1].children[0] as HTMLInputElement;
        input.focus();
        input.select();
      }, 200)
    }
  }

  validarInputs(): boolean {
    let hayErrores: boolean = false;
    this.dataSource.data.map((item, index) => {
      item.errorMsg = {};
      if (!item.name) {
        hayErrores = true;
        item.errorMsg["name"] = "no hay datos";
        this.selectedInput = ("name" + (index + 1));
      }

      if (!item.tx) {
        hayErrores = true;
        item.errorMsg["tx"] = "no hay datos";
        this.selectedInput = ("tx" + (index + 1));
      }

      if (!item.rx) {
        hayErrores = true;
        item.errorMsg["rx"] = "no hay datos";
        this.selectedInput = ("rx" + (index + 1));
      }

      if (!item.precio) {
        hayErrores = true;
        item.errorMsg["precio"] = "no hay datos";
        this.selectedInput = ("precio" + (index + 1));
      }

      if (!item.descripcion) {
        hayErrores = true;
        item.errorMsg["descripcion"] = "no hay datos";
        this.selectedInput = ("descripcion" + (index + 1));
      }

    });
    console.log("validando")
    return !hayErrores;
  }


}
