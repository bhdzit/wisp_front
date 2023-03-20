import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SectorsService } from 'src/app/services/sectores.services';
import { TorresService } from 'src/app/services/torres.services';
import Swal from 'sweetalert2';
import { TorreVO } from '../torre/torre.component';

export interface SectorVO {
  id?: number;
  name?: string;
  torre?: number | null;
  tipoAntena?: boolean | null;
  nueva: boolean;
  editada: boolean;
  eliminada?: boolean;
}


@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.css']
})
export class SectorComponent implements OnInit {
  listaDeCambios: Observable<any>[] = [];
  dataSource: SectorVO[] = [];
  submitErrorMsg: any = {};
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'opciones'];
  selectedInput: string = "";
  listaDeTorres: TorreVO[] = [];
  filasEliminadas: SectorVO[] = []

  constructor(private _sectorsService: SectorsService, private _torresService: TorresService) { }
  ngOnInit(): void {
    this._sectorsService.getSectors().subscribe(then => {
      this.dataSource = then;
    });
    this.findTorres();
  }

  async canDeactivate() {

    if (this.listaDeCambios.length > 0) {
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

  agregarSector() {
    this.dataSource = [...this.dataSource, { tipoAntena: null, nueva: true, editada: false }];
  }
  saveClick() {
    this.dataSource.map(item => {
      if (item.editada && !item.nueva) {
        console.log(item, "editada");
        this.listaDeCambios.push(this._sectorsService.updateSector(item));
      };
      if (item.nueva) {
        console.log(item, "nueva")
        this.listaDeCambios.push(this._sectorsService.saveSector(item));
      };


    });

    this.filasEliminadas.map(item => {
      if (!item.nueva) console.log(item, "eliminada");
      this.listaDeCambios.push(this._sectorsService.destroySector(item));
    });

    this.saveSectores(0);

  }

  saveSectores(index: number) {
    if (this.listaDeCambios.length > 0 && this.listaDeCambios.length > index) {
      this.listaDeCambios[index].subscribe(then => {
        index++;
        console.log(index);
        this.saveSectores(index);
        if (index == this.listaDeCambios.length) {
          this.dataSource = then;
          this.listaDeCambios = [];
        }
      });
    }
  }

  findTorres() {
    this._torresService.getTorres().subscribe(then => {
      this.listaDeTorres = then;
    });
  }

  eliminar(element: SectorVO) {
    this.filasEliminadas.push({ ...element });
    this.dataSource = this.dataSource.filter(item => element != item);

  }


}
