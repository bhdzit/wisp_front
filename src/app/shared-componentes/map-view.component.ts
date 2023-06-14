import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import H from '@here/maps-api-for-javascript';
import { TorreVO } from '../componentes/torre/torre.component';
import { ClienteVO } from '../componentes/clientes/clientes.component';

@Component({
    selector: 'app-map-view',
    templateUrl: './map-view.component.html',
    styleUrls: ['./map-view.component.scss']
})


export class MapViewComponent implements OnInit {
    private map?: H.Map;
    private marker: any;
    @Output() coordsChangeEvent: EventEmitter<any> = new EventEmitter();
    @Input() punto!:TorreVO|ClienteVO;


    ngOnInit(): void {
        console.log(this.punto);
    }



    @ViewChild('map') mapDiv?: ElementRef;

    ngAfterViewInit(): void {
        if (!this.map && this.mapDiv) {
            // instantiate a platform, default layers and a map as usual
            const platform = new H.service.Platform({
                'apikey': 'SEI-1bn-6vSC9G7pEalClDrOHK1w38l5IUSl_XrE5s0'
            });
            const layers: any = platform.createDefaultLayers();
            const map = new H.Map(
                this.mapDiv.nativeElement,
                layers.vector.normal.map,
                {
                    pixelRatio: window.devicePixelRatio,
                    center: { lat: 20.2921006, lng: -99.186517 },
                    zoom: 13,

                },
            );

            // add a resize listener to make sure that the map occupies the whole container
            window.addEventListener('resize', () => map.getViewPort().resize());

            //Step 3: make the map interactive
            // MapEvents enables the event system
            // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
            var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

            // Create the default UI components
            var ui = H.ui.UI.createDefault(map, layers);
            this.map = map;
            if("lat" in this.punto)
            this.addOnTapMarck({ lat: this.punto.lat, lng: this.punto.lng });
            this.addClickEvent();
        }
    }

    addClickEvent() {
        this.map?.addEventListener('tap', (evt: any) => {
            let coord: any = this.map?.screenToGeo(evt.currentPointer.viewportX,
                evt.currentPointer.viewportY);
            if (this.marker != undefined) {
                this.map?.removeObject(this.marker);
                this.marker = undefined;
            }

            this.coordsChangeEvent.emit({ lat: coord.lat, lng: coord.lng });
            this.addOnTapMarck({
                lat: coord.lat,
                lng: coord.lng
            });
        });
    }

    addOnTapMarck(cords: any) {
        if (this.marker != undefined) this.map?.removeObject(this.marker);

        let icon: H.map.Icon = new H.map.Icon("./assets/img/zona2.png");
        this.marker = new H.map.Marker(cords, { data: {}, icon: icon });
        this.map?.addObject(this.marker);

    }

}