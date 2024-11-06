// point.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-point',
  template: './point.component.html', 
  styleUrls: ['./point.component.css'],
  standalone: true,
})
export class PointComponent {
  @Input() point!: any;
  @Output() pointDragged = new EventEmitter<{ marker: L.Marker; point: any }>();

  constructor() {
    if (this.point && this.point.marker) {
      this.point.marker.on('dragend', (e: any) => {
        this.pointDragged.emit({ marker: e.target, point: this.point });
      });
    }
  }
}