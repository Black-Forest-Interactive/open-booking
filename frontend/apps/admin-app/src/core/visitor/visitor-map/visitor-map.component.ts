import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';

import * as L from 'leaflet';
import {BookingMapService} from "./booking-map.service";
import {MapStatsService} from "./map-stats.service";
import {PlzCluster} from "./map-stats.model";
import {BookingStatus, VisitorType} from "@open-booking/core";

export const STATUS_CONFIG: Record<BookingStatus, { hex: string }> = {
  UNKNOWN: {hex: '#94a3b8'}, // slate-400
  PENDING: {hex: '#f59e0b'}, // amber-500
  CONFIRMED: {hex: '#059669'}, // emerald-600
  DECLINED: {hex: '#ef4444'}, // red-500
  CANCELLED: {hex: '#f97316'}, // orange-500
  EXPIRED: {hex: '#64748b'}, // slate-500
};

export const TYPE_CONFIG: Record<VisitorType, { icon: string; color: string }> = {
  SINGLE: {icon: 'person', color: '#8b5cf6'},
  GROUP: {icon: 'groups', color: '#f97316'},
};

@Component({
  selector: 'app-visitor-map',
  standalone: true,
  // ← kein styleUrls, kein styles
  imports: [
    CommonModule, FormsModule, TranslateModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatTooltipModule, MatDividerModule,
  ],
  templateUrl: './visitor-map.component.html',
})
export class VisitorMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainerRef!: ElementRef<HTMLDivElement>;

  private readonly statsService = inject(MapStatsService);
  protected readonly bookingMap = inject(BookingMapService);
  private readonly translate = inject(TranslateService);

  readonly loading = this.bookingMap.loading;
  readonly error = this.bookingMap.error;
  readonly progress = this.bookingMap.progress;

  private map?: L.Map;
  private markerLayer?: L.LayerGroup;

  readonly stats = this.statsService.stats;
  readonly filters = this.statsService.filters;
  readonly selectedCluster = signal<PlzCluster | null>(null);
  readonly filtersOpen = signal(true);

  readonly allStatuses: BookingStatus[] = ['UNKNOWN', 'PENDING', 'CONFIRMED', 'DECLINED', 'CANCELLED', 'EXPIRED'];
  readonly allTypes: VisitorType[] = ['SINGLE', 'GROUP'];

  searchTerm = '';
  selectedStatuses: BookingStatus[] = [...this.statsService.filters().statuses]
  selectedTypes: VisitorType[] = [...this.statsService.filters().types]

  readonly topClusters = computed(() => this.stats().clusters.slice(0, 8));
  readonly maxClusterCount = computed(() => this.topClusters()[0]?.count ?? 1);
  readonly activeFilterCount = computed(() => {
    const f = this.filters();
    return f.statuses.length + f.types.length + (f.search ? 1 : 0);
  });

  constructor() {
    effect(() => {
      const clusters = this.stats().clusters;
      if (this.map && this.markerLayer) this.renderMarkers(clusters);
    });
  }

  ngOnInit(): void {
    this.translate.setDefaultLang('de');
    this.translate.use('de');
    this.bookingMap.load();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private initMap(): void {
    this.map = L.map(this.mapContainerRef.nativeElement, {
      center: [51.1657, 10.4515], zoom: 6, zoomControl: false,
    });
    L.control.zoom({position: 'bottomright'}).addTo(this.map);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd', maxZoom: 19,
    }).addTo(this.map);
    this.markerLayer = L.layerGroup().addTo(this.map);
    this.renderMarkers(this.stats().clusters);
  }

  private renderMarkers(clusters: PlzCluster[]): void {
    this.markerLayer?.clearLayers();
    if (!this.map) return;
    const maxCount = clusters[0]?.count ?? 1;

    for (const cluster of clusters) {
      const radius = 10 + (cluster.count / maxCount) * 30;
      const color = STATUS_CONFIG[this.getDominantStatus(cluster)]?.hex ?? '#6366f1';

      const circle = L.circleMarker([cluster.lat, cluster.lng], {
        radius, fillColor: color, color: '#fff',
        weight: 2, opacity: 0.9, fillOpacity: 0.75,
      });

      circle.bindTooltip(
        `<div style="padding:8px 12px;background:rgba(15,23,42,.92);border-radius:8px;color:#fff;font-family:inherit">
          <strong style="font-size:13px;display:block">${cluster.zip} ${cluster.city}</strong>
          <span style="font-size:11px;opacity:.8">${cluster.count} Buchungen · ${cluster.totalPersons} Personen</span>
        </div>`,
        {direction: 'top', className: 'leaflet-tooltip-clean'}
      );
      circle.on('click', () => this.selectCluster(cluster));
      this.markerLayer?.addLayer(circle);
    }
  }

  private getDominantStatus(cluster: PlzCluster): BookingStatus {
    let max = 0;
    let dominant: BookingStatus = 'PENDING';
    for (const [s, c] of Object.entries(cluster.statusBreakdown) as [BookingStatus, number][]) {
      if (c > max) {
        max = c;
        dominant = s;
      }
    }
    return dominant;
  }

  selectCluster(cluster: PlzCluster): void {
    this.selectedCluster.set(cluster);
    this.map?.flyTo([cluster.lat, cluster.lng], 12, {duration: 0.8});
  }

  closeDetail(): void {
    this.selectedCluster.set(null);
  }

  applySearch(): void {
    this.statsService.updateFilters({search: this.searchTerm});
  }

  toggleStatus(s: BookingStatus): void {
    const i = this.selectedStatuses.indexOf(s);
    if (i >= 0) this.selectedStatuses.splice(i, 1); else this.selectedStatuses.push(s);
    this.statsService.updateFilters({statuses: [...this.selectedStatuses]});
  }

  toggleType(t: VisitorType): void {
    const i = this.selectedTypes.indexOf(t);
    if (i >= 0) this.selectedTypes.splice(i, 1); else this.selectedTypes.push(t);
    this.statsService.updateFilters({types: [...this.selectedTypes]});
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatuses = [];
    this.selectedTypes = [];
    this.statsService.resetFilters();
  }

  isStatusActive(s: BookingStatus): boolean {
    return this.selectedStatuses.includes(s);
  }

  isTypeActive(t: VisitorType): boolean {
    return this.selectedTypes.includes(t);
  }

  getStatusEntries(breakdown: Record<string, number>): [string, number][] {
    return Object.entries(breakdown).sort(([, a], [, b]) => b - a);
  }

  getStatusPercent(count: number, total: number): number {
    return total ? Math.round((count / total) * 100) : 0;
  }

  getBarWidth(count: number, max: number): number {
    return max ? Math.round((count / max) * 100) : 0;
  }

  statusKey(s: string): string {
    return 'BOOKING.Status.' + s;
  }

  typeKey(t: string): string {
    return 'VISITOR.Type.' + t;
  }

  typeIcon(t: string): string {
    return TYPE_CONFIG[t as VisitorType]?.icon ?? 'group';
  }

  typeColor(t: string): string {
    return TYPE_CONFIG[t as VisitorType]?.color ?? '#6366f1';
  }

  statusHex(s: string): string {
    return STATUS_CONFIG[s as BookingStatus]?.hex ?? '#6366f1';
  }
}
