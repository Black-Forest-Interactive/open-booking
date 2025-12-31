import {Component, computed, OnDestroy, OnInit, resource} from '@angular/core';
import {SearchOperatorInfo} from "@open-booking/core";
import {Subject} from "rxjs";
import {SearchService} from "@open-booking/admin";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {NgClass} from "@angular/common";
import {toPromise} from "@open-booking/shared";

@Component({
  selector: 'app-search',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    TranslatePipe,
    NgClass,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit, OnDestroy {

  private searchResource = resource({
    loader: (param) => {
      return toPromise(this.service.getAllInfo(), param.abortSignal)
    }
  })

  entries = computed(() => this.searchResource.value() ?? [])
  reloading = this.searchResource.isLoading

  private unsub = new Subject<void>();

  constructor(
    private service: SearchService,
  ) {
  }

  ngOnInit(): void {
    // timer(0, 500).pipe(
    //   takeUntil(this.unsub),
    //   switchMap(async () => this.searchResource.reload())
    // ).subscribe()
  }

  ngOnDestroy(): void {
    this.unsub.next();
    this.unsub.complete();
  }

  setup(info: SearchOperatorInfo) {
    this.service.setup(info.key).subscribe()
  }
}
