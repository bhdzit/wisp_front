import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TorresService } from 'src/app/services/torres.services';
import { TorreVO } from '../torre.component';
@Component({
  selector: 'app-torre-info',
  templateUrl: './torre-info.component.html',
  styleUrls: ['./torre-info.component.css']
})


export class TorreInfoComponent implements OnInit {



  torre!: TorreVO;
  submitErrorMsg: any = {};
  constructor(public dialog: MatDialogRef<TorreInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TorreVO,
    private _torresService: TorresService) { }

  ngOnInit(): void {
    this.torre = this.data || {};
  }

  guardarTorre() {
    this.submitErrorMsg={};
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
        console.log(then);
        this.dialog.close({ data: then });
      });
  }

  coordsChangeEvent(evt: any) {
    this.torre.lat = evt.lat;
    this.torre.lng = evt.lng;
  }


}