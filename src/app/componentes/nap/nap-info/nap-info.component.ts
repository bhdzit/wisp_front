import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NapVO } from '../nap.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NapService } from 'src/app/services/nap.services';
import { MapViewComponent } from 'src/app/shared-componentes/map-view.component';
import { OltVO } from '../../olt/olt.component';
import { OLTSService } from 'src/app/services/olts.services';

@Component({
  selector: 'app-nap-info',
  templateUrl: './nap-info.component.html',
  styleUrls: ['./nap-info.component.css']
})
export class NapInfoComponent implements OnInit, AfterViewInit {



  napVO!:NapVO;
  submitErrorMsg: any = {};
  oltArray:OltVO[] = [];

  constructor(public dialog: MatDialogRef<NapInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NapVO,
    private _NapService: NapService,
    private _OLTSService:OLTSService) { }
  @ViewChild(MapViewComponent) _mapComponent: MapViewComponent | undefined;
  ngOnInit(): void {
    this.napVO = this.data || {olt:null};    
    this.getOlts();
  }

  ngAfterViewInit(): void {
    if (this.data != null)
      this._mapComponent?.addOnTapMarck({ lat: this.data.lat, lng: this.data.lng })
  }

  guardarNap() {
    this.submitErrorMsg = {};
    if (this.napVO.id == undefined)
      this._NapService.saveNaps(this.napVO).subscribe(then => {
        if ("errors" in then) {
          this.submitErrorMsg = then.errors;
          console.log(this.submitErrorMsg);
        }
        else
          this.dialog.close({ data: then });
      }
      );
    else
      this._NapService.updateNap(this.napVO).subscribe(then => {
        if ("errors" in then) {
          this.submitErrorMsg = then.errors;
          console.log(this.submitErrorMsg);
        }
        else
          this.dialog.close({ data: then });
      });
  }

  coordsChangeEvent(evt: any) {
    this.napVO.lat = evt.lat;
    this.napVO.lng = evt.lng;
  }

  close(){
    this.dialog.close();
  }

  getOlts(){
   this._OLTSService.getOlts().subscribe(then=>{
      this.oltArray = then;
    });
  }

}