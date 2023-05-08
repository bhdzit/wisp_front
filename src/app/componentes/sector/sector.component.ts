import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Observable, concat, retry } from 'rxjs';
import { SectorsService } from 'src/app/services/sectores.services';
import { TorresService } from 'src/app/services/torres.services';
import Swal from 'sweetalert2';
import { TorreVO } from '../torre/torre.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface SectorVO {
  id?: number;
  name?: string;
  torre?: number | null;
  torreStr?: string | null;
  tipoAntena?: boolean | null;
  nueva?: boolean;
  editada?: boolean;
  eliminada?: boolean;
  errorMsg?: any
}


@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.css']
})
export class SectorComponent implements OnInit {
  listaDeCambios: Observable<any>[] = [];
  dataSource: MatTableDataSource<SectorVO> = new MatTableDataSource();
  submitErrorMsg: any = {};
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'opciones'];
  selectedInput: string = "";
  listaDeTorres: TorreVO[] = [];
  filasEliminadas: SectorVO[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  filtradoTxt: string = "";
  dataSourceBkp: SectorVO[] = [];


  constructor(private _sectorsService: SectorsService, private _torresService: TorresService) { }

  @HostListener('document:keydown.tab', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (this.selectedInput != '') {
      event.preventDefault();

      let target = document.getElementById(this.selectedInput) as HTMLElement;
      let nextTargetID: string | null = target.getAttribute("next-tab-input");
      this.selectedInput = "";
      if (nextTargetID != null) {
        let nextTarget = document.getElementById(nextTargetID) as HTMLSelectElement;

        setTimeout(() => {
          if (nextTargetID != null) {
            this.selectedInput = nextTargetID;
            setTimeout(() => {
              nextTarget.focus();
            }, 200);
            console.log(this.selectedInput);
          }
        }, 200);
      }
    }

  }

  ngOnInit(): void {
    this._sectorsService.getSectors().subscribe(then => {
      this.dataSource.data = then;
      this.dataSource.paginator = this.paginator;
      this.dataSourceBkp = [...JSON.parse(JSON.stringify(then))];
    });
    this.findTorres();
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


      // you logic goes here, whatever that may be 
      // and it must return either True or False

      return res.isConfirmed
    }
    return true;
  }

  agregarSector() {
    this.dataSource.data = [...this.dataSource.data, { tipoAntena: null, nueva: true, editada: false, torre: null }];
    setTimeout(() => {
      this.dataSource.paginator?.lastPage();

    }, 500);
  }

  validarInputs(): boolean {
    let hayErrores: boolean = false;
    this.dataSource.data.map((item, index) => {
      item.errorMsg = {};
      if (!item.name) {
        hayErrores = true;
        item.errorMsg["name"] = "no hay datos";
        this.selectedInput = ("ssid" + (index + 1));
      }
      if (item.tipoAntena == null) {
        hayErrores = true;
        item.errorMsg["tipoAntena"] = "no hay datos";
        this.selectedInput = ("tipoAntena" + (index + 1));
      }

      if (item.torre == null) {
        hayErrores = true;
        item.errorMsg["torre"] = "no hay datos";
        this.selectedInput = ("torre" + (index + 1));

      }
    });
    console.log("validando")
    return !hayErrores;
  }

  saveClick() {
    if (this.validarInputs()) {
      this.dataSource.data.map(item => {
        if (item.editada && !item.nueva) {
          //console.log(item, "editada");
          this.listaDeCambios.push(this._sectorsService.updateSector(item));
        };
        if (item.nueva) {
          // console.log(item, "nueva")
          this.listaDeCambios.push(this._sectorsService.saveSector(item));
        };


      });

      this.filasEliminadas.map(item => {
        if (!item.nueva) console.log(item, "eliminada");
        this.listaDeCambios.push(this._sectorsService.destroySector(item));
      });

      this.saveSectores(0);
    }
  }

  saveSectores(index: number) {
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
      }
    );
  }

  findTorres() {
    this._torresService.getTorres().subscribe(then => {
      this.listaDeTorres = then;
    });
  }

  eliminar(element: SectorVO) {
    this.filasEliminadas.push({ ...element });
    this.dataSource.data = this.dataSource.data.filter(item => element != item);

  }

  eliminarMsj(item: SectorVO, atributo: string) {
    if (item.errorMsg != null)
      item.errorMsg[atributo] = '';
    return true;
  }


  filtrado(e: KeyboardEvent) {
    this.dataSource.filter = ((e.target as HTMLInputElement).value);
  }

  getTorreSelecionada(item: SectorVO) {

    item.torreStr = this.listaDeTorres.filter(torre => torre.id == item.torre)[0]?.nombre;
    return true;
  }

  descartarClick() {
    this.filtradoTxt = "";
    this.dataSource = new MatTableDataSource([...JSON.parse(JSON.stringify(this.dataSourceBkp))]);
    this.dataSource.paginator = this.paginator;
  }

}
