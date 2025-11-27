import {Component, Input} from '@angular/core';
import {defaultVisitorGroup, VisitorGroup} from "../../../visitor-group/model/visitor-group-api";
import {MatDialog} from "@angular/material/dialog";
import {VisitorGroupService} from "../../visitor-group/model/visitor-group.service";
import {VisitorGroupInfoDialogComponent} from "../../visitor-group/visitor-group-info-dialog/visitor-group-info-dialog.component";

@Component({
  selector: 'app-request-board-visitor-group-cell',
  templateUrl: './request-board-visitor-group-cell.component.html',
  styleUrls: ['./request-board-visitor-group-cell.component.scss']
})
export class RequestBoardVisitorGroupCellComponent {

  @Input() data: VisitorGroup = defaultVisitorGroup
  @Input() showDetails: boolean = true
  confirming: boolean = false


  constructor(private visitorGroupService: VisitorGroupService, private dialog: MatDialog) {
  }

  confirm() {
    if (this.confirming) return

    this.confirming = true
    this.visitorGroupService.confirmVisitorGroup(this.data.id).subscribe(
      {
        next: d => this.handleVisitorGroupChange(d),
        error: (err) => this.confirming = false
      }
    )
  }

  private handleVisitorGroupChange(d: VisitorGroup) {
    this.data = d
    this.confirming = false
  }

  showDetailsDialog() {
    this.dialog.open(VisitorGroupInfoDialogComponent, {data: this.data});
  }


}
