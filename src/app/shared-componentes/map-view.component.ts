import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output, Input } from '@angular/core';
//import H from '@here/maps-api-for-javascript';
import { TorreVO } from '../componentes/torre/torre.component';
import { ClienteVO } from '../componentes/clientes/clientes.component';
import { Loader } from "@googlemaps/js-api-loader"
import { Map } from '@here/maps-api-for-javascript';
import { NumberSymbol } from '@angular/common';
@Component({
    selector: 'app-map-view',
    templateUrl: './map-view.component.html',
    styleUrls: ['./map-view.component.scss']
})


export class MapViewComponent implements OnInit {

    loader!: Loader;
    @Output() coordsChangeEvent: EventEmitter<any> = new EventEmitter();
    @Input() punto!: TorreVO | ClienteVO;
    map: any;
    puntoDeOrigin:any={ lat: 20.2921006, lng: -99.186517 };
    marker!:google.maps.Marker;
    isMapLoaded:boolean= false;
    constructor() {
        this.loader = new Loader({
            apiKey: "AIzaSyAr7JKFrcZWgyyavyC476c_WOlL7GVUVKg",
            version: "weekly",
        });
        this.loader.load().then(() => {
            // The map, centered at Uluru
            this.map = new google.maps.Map(
                document.getElementById("map") as HTMLElement,
                {
                    zoom: 13,
                    center: this.puntoDeOrigin,
                }
            );
            this.setClickEvent();
            this.isMapLoaded=true;

        });
    }

    setClickEvent(){
        this.map.addListener("click", (evt:any) => {
            const cord=evt.latLng;
            this.addOnTapMarck( { lat: cord.lat(), lng: cord.lng() });
        });
    }

    ngOnInit(): void {

    }



    async addOnTapMarck(cord: any) {
        console.log(cord,this.isMapLoaded);
        if(!this.isMapLoaded) setTimeout(() => this.addOnTapMarck(cord), 1000);
        cord.lat=Number(cord.lat);
        cord.lng=Number(cord.lng);

        if(this.marker!=undefined)this.marker.setMap(null)
        const image =
        "./assets/img/zona2.png";
    
        this.marker = new google.maps.Marker({
            position: cord,
            icon: image,
            map: this.map,
        });
        this.coordsChangeEvent.emit({ lat: cord.lat, lng: cord.lng });
    }



}