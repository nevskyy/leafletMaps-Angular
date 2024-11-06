import { Component, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PointComponent } from './point/point.component';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [PointComponent, CommonModule]
})
export class AppComponent implements AfterViewInit {
  title = 'Destroy Moscow';
  map!: L.Map;
  points: any[] = [];
  polyline!: L.Polyline;

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([55.7558, 37.6173], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.addPoint(event.latlng);
    });

    L.marker([55.7558, 37.6173]).addTo(this.map);
  }

  addPoint(latlng: L.LatLng) {
    const droneIcon = L.icon({
      iconUrl: './drone.png',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });

    const point = {
      number: this.points.length + 1,
      lat: latlng.lat,
      lng: latlng.lng,
      height: 0,
      marker: L.marker([latlng.lat, latlng.lng], { draggable: true, icon: droneIcon }).addTo(this.map)
    };

    point.marker.bindPopup(`
      <strong>Point ${point.number}</strong><br>
      Latitude: ${point.lat}<br>
      Longitude: ${point.lng}<br>
      Height: ${point.height}<br>
      <button class="remove-btn" style="background-color: #007bff; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15); transition: background-color 0.3s, transform 0.2s;">Remove</button>
    `);

    point.marker.on('dragend', () => this.updatePoint(point));

    point.marker.on('popupopen', () => {
      const removeBtn = document.querySelector('.remove-btn');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => this.removePoint(point));
      }
    });

    this.points.push(point);
    this.updateRoute();
  }

  updatePoint(point: any) {
    point.lat = point.marker.getLatLng().lat;
    point.lng = point.marker.getLatLng().lng;
    this.updateRoute();
  }

  updateRoute() {
    if (this.points.length > 1) {
      const latlngs = this.points.map(point => [point.lat, point.lng]);

      if (this.polyline) {
        this.polyline.setLatLngs(latlngs);
      } else {
        this.polyline = L.polyline(latlngs, { color: 'blue' }).addTo(this.map);
      }
    }
  }

  removePoint(point: any) {
    point.marker.remove();
    this.points = this.points.filter(p => p !== point);
    this.points.forEach((point, idx) => point.number = idx + 1); // Reindex points
    this.updateRoute();
  }
}