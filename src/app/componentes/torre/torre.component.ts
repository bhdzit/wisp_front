import { Component, OnInit } from '@angular/core';
import { TorresService } from 'src/app/services/torres.services';

export interface TorreVO {
  id?: number;
  nombre?: string,
  altura?: number,
  lat?: string,
  lng?: string,
}


@Component({
  selector: 'app-torre',
  templateUrl: './torre.component.html',
  styleUrls: ['./torre.component.css']
})


export class TorreComponent implements OnInit {

  constructor(private _torresService: TorresService) { }

  ngOnInit(): void {
    this._torresService.getTorres().subscribe(then => {
      this.dataSource = then;
    });
  }


  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','opciones'];
  dataSource = [];
}
