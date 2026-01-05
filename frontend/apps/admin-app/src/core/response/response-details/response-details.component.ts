import {Component, computed, inject, resource} from '@angular/core';
import {ResponseService} from "@open-booking/admin";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {map} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {navigateToResponse} from "../../../app/app.navigation";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {ResponseDeleteDialogComponent} from "../response-delete-dialog/response-delete-dialog.component";

@Component({
  selector: 'app-response-details',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    LoadingBarComponent,
    TranslatePipe,
    RouterLink

  ],
  templateUrl: './response-details.component.html',
  styleUrl: './response-details.component.scss',
})
export class ResponseDetailsComponent {
  private route = inject(ActivatedRoute)
  responseId = toSignal(this.route.paramMap.pipe(map(param => +(param.get('id') ?? ''))))

  private responseResource = resource({
    params: this.responseId,
    loader: param => toPromise(this.service.getResponse(param.params), param.abortSignal)
  })

  reloading = computed(() => this.responseResource.isLoading())
  data = computed(() => this.responseResource.value())

  title = computed(() => this.data()?.title ?? '')
  lang = computed(() => this.data()?.lang ?? '')
  type = computed(() => this.data()?.type ?? '')
  content = computed(() => this.data()?.content ?? '')

  constructor(
    private service: ResponseService,
    private router: Router,
    private dialog: MatDialog,
  ) {
  }

  back() {
    navigateToResponse(this.router)
  }

  reload() {
    this.responseResource.reload()
  }

  protected delete() {
    let response = this.data()
    if (!response) return
    let dialogRef = this.dialog.open(ResponseDeleteDialogComponent, {data: response})

    dialogRef.afterClosed().subscribe((value) => {
      if (value) this.service.deleteResponse(response.id).subscribe(() => this.back())
    })
  }
}
