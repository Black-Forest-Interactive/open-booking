import {Component} from '@angular/core';
import {AuditLogService} from "../model/audit-log.service";
import {ActivatedRoute} from "@angular/router";
import {AuditLogEntry} from "../model/audit-log-entry-api";
import {Location} from "@angular/common";

@Component({
  selector: 'app-audit-log-entry-details',
  templateUrl: './audit-log-entry-details.component.html',
  styleUrls: ['./audit-log-entry-details.component.scss']
})
export class AuditLogEntryDetailsComponent {
  reloading: boolean = false

  data: AuditLogEntry | undefined = undefined

  content: string = ""

  constructor(private service: AuditLogService, private route: ActivatedRoute, private location: Location) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(value => {
        let id = value.get('id')
        if (id) {
          this.reloading = true
          this.service.getAuditLogEntry(+id)
            .subscribe({
              next: d => this.handleData(d),
              error: e => this.reloading = false
            })
        }
      }
    )
  }

  private handleData(d: AuditLogEntry) {
    this.data = d

    this.content = JSON.stringify(JSON.parse(d.reference),null,2)
    this.reloading = false
  }

  back() {
    this.location.back()
  }
}
