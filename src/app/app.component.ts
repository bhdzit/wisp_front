import { Component } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'wisp_front';

  constructor(
    private paginator: MatPaginatorIntl
  ) {
    this.paginator.itemsPerPageLabel = "Registros por página";
    this.paginator.getRangeLabel
  }

}
