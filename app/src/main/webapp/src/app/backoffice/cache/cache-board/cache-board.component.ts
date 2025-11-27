import {Component} from '@angular/core';
import {HotToastService} from "@ngneat/hot-toast";
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {CacheService} from "../model/cache.service";
import {CacheInfo} from "../model/cache-api";

@Component({
  selector: 'app-cache-board',
  templateUrl: './cache-board.component.html',
  styleUrls: ['./cache-board.component.scss']
})
export class CacheBoardComponent {
  reloading: boolean = false
  data: CacheInfo[] = []
  displayedColumns: string[] = ['name', 'hit', 'load', 'evict', 'cmd']


  constructor(
    private service: CacheService,
    private toastService: HotToastService,
    private translateService: TranslateService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.reload()
  }

  private reload() {
    if (this.reloading) return
    this.reloading = true

    this.service.getAllCacheInfos().subscribe(d => this.handleData(d))
  }

  private handleData(d: CacheInfo[]) {
    this.data = d
    this.reloading = false
  }

  resetCache(info: CacheInfo) {
    if (this.reloading) return
    this.reloading = true

    this.service.resetCache(info.key).subscribe(d => this.alterData(d))
  }

  private alterData(d: CacheInfo) {
    let index = this.data.findIndex(c => c.key == d.key)
    if (index >= 0) this.data[index] = d
    this.reloading = false
  }
}
