import { Component } from '@angular/core';

@Component({
  selector: 'app-clientes-info',
  templateUrl: './clientes-info.component.html',
  styleUrls: ['./clientes-info.component.css']
})
export class ClientesInfoComponent {
  submitErrorMsg: any = {};

  coordsChangeEvent(evt: any) {
  }

}
