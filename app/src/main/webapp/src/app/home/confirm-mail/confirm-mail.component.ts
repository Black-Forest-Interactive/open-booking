import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HomeService} from "../model/home.service";
import {GenericRequestResult} from "../../shared/shared-api";

@Component({
  selector: 'app-confirm-mail',
  templateUrl: './confirm-mail.component.html',
  styleUrls: ['./confirm-mail.component.scss']
})
export class ConfirmMailComponent {

  reloading: boolean = false

  result: GenericRequestResult | undefined = undefined

  status: string = 'unknown'

  constructor(private service: HomeService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(value => {
        let key = value.get('key')
        if (key) {
          this.reloading = true
          this.service.confirmEmail(key).subscribe(d => this.handleResult(d))
        }
      }
    )
  }

  private handleResult(result: GenericRequestResult) {
    this.result = result
    this.status = (result.success) ? 'confirmed': 'failed'
    this.reloading = false
  }
}
