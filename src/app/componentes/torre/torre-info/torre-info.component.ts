import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TorresService } from 'src/app/services/torres.services';
import { TorreVO } from '../torre.component';

import { MapViewComponent } from 'src/app/shared-componentes/map-view.component';
@Component({
  selector: 'app-torre-info',
  templateUrl: './torre-info.component.html',
  styleUrls: ['./torre-info.component.css']
})


export class TorreInfoComponent implements OnInit, AfterViewInit {



  torre!: TorreVO;
  submitErrorMsg: any = {};
  constructor(public dialog: MatDialogRef<TorreInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TorreVO,
    private _torresService: TorresService) { }
  @ViewChild(MapViewComponent) _mapComponent: MapViewComponent | undefined;
  ngOnInit(): void {
    this.torre = this.data || {};

  }

  ngAfterViewInit(): void {
    console.log(this._mapComponent);
    if (this.data != null)
      this._mapComponent?.addOnTapMarck({ lat: this.data.lat, lng: this.data.lng })
  }

  guardarTorre() {
    this.submitErrorMsg = {};
    if (this.torre.id == undefined)
      this._torresService.saveTorres(this.torre).subscribe(then => {
        if ("errors" in then) {
          this.submitErrorMsg = then.errors;
          console.log(this.submitErrorMsg);
        }
        else
          this.dialog.close({ data: then });
      }
      );
    else
      this._torresService.updateTorre(this.torre).subscribe(then => {
        if ("errors" in then) {
          this.submitErrorMsg = then.errors;
          console.log(this.submitErrorMsg);
        }
        else
          this.dialog.close({ data: then });
      });
  }

  coordsChangeEvent(evt: any) {
    console.log(evt.lat)
    this.torre.lat = evt.lat;
    this.torre.lng = evt.lng;
  }


}