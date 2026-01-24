import {Component, computed, resource, signal} from '@angular/core';
import {CommonModule} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {RouterLink} from "@angular/router";
import {AuditService} from "@open-booking/admin";
import {MainContentComponent} from "../../shared/main-content/main-content.component";

@Component({
  selector: 'app-audit',
  imports: [
    CommonModule,
    TranslatePipe,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RouterLink,
    MainContentComponent,
    LoadingBarComponent
  ],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.scss',
})
export class AuditComponent {


  displayedColumns: string[] = ['timestamp', 'user', 'level', 'message', 'source']
  pageNumber = signal(0)
  pageSize = signal(25)

  private auditLogCriteria = computed(() => ({
    page: this.pageNumber(),
    size: this.pageSize()
  }))

  private auditLogResource = resource({
    params: this.auditLogCriteria,
    loader: (param) => {
      return toPromise(this.service.getAllAuditLogEntry(param.params.page, param.params.size), param.abortSignal)
    }
  })

  private page = computed(() => this.auditLogResource.value())
  entries = computed(() => this.page()?.content ?? [])
  totalElements = computed(() => this.page()?.totalSize ?? 0)
  reloading = this.auditLogResource.isLoading


  constructor(private service: AuditService) {
  }

  protected handlePageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex)
    this.pageSize.set(event.pageSize)
  }
}
