import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapViewComponent } from 'src/app/shared-componentes/map-view.component';
import { OltVO } from '../olt.component';
import { OLTSService } from 'src/app/services/olts.services';
@Component({
  selector: 'app-olt-info',
  templateUrl: './olt-info.component.html',
  styleUrls: ['./olt-info.component.css']
})


export class OltInfoComponent implements OnInit, AfterViewInit {



  oltVO!: OltVO
  submitErrorMsg: any = {};
  constructor(public dialog: MatDialogRef<OltInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OltVO,
    private _oltsService:OLTSService) { }
  @ViewChild(MapViewComponent) _mapComponent: MapViewComponent | undefined;
  ngOnInit(): void {
    this.oltVO = this.data || {};

  }

  ngAfterViewInit(): void {
    console.log(this._mapComponent);
    if (this.data != null)
      this._mapComponent?.addOnTapMarck({ lat: this.data.lat, lng: this.data.lng })
  }

  guardarOLT() {
    this.submitErrorMsg = {};
    if (this.oltVO.id == undefined)
      this._oltsService.saveOlts(this.oltVO).subscribe(then => {
        if ("errors" in then) {
          this.submitErrorMsg = then.errors;
          console.log(this.submitErrorMsg);
        }
        else
          this.dialog.close({ data: then });
      }
      );
    else
      this._oltsService.updateOlt(this.oltVO).subscribe(then => {
        if ("errors" in then) {
          this.submitErrorMsg = then.errors;
        }
        else
          this.dialog.close({ data: then });
      });
  }

  coordsChangeEvent(evt: any) {
    console.log(evt.lat)
    this.oltVO.lat = evt.lat;
    this.oltVO.lng = evt.lng;
  }

  close(){
    this.dialog.close();
  }


}