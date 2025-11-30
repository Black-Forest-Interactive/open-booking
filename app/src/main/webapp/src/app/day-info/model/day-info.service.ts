import {Injectable} from '@angular/core';
import {BaseService} from "../../shared/base-service";
import {HttpClient} from "@angular/common/http";
import {LoggingService} from "../../shared/logging/logging.service";
import {BehaviorSubject, Observable} from "rxjs";
import {DateRangeSelectionRequest, DayInfo, OfferSelectionEntry} from "./day-info-api";
import {EChartsOption} from "echarts";
import {TranslateService} from "@ngx-translate/core";
import {DayInfoHelper, DayInfoOffer} from "../../offer/model/offer-api";

@Injectable({
  providedIn: 'root'
})
export class DayInfoService extends BaseService {

  constructor(http: HttpClient, logging: LoggingService, private translate: TranslateService) {
    super(http, 'frontend/user', logging)
    this.translate.get('DAY_INFO.Chart.Space.Series.Deactivated').subscribe(v => this.labelDeactivated = v)
    this.translate.get('DAY_INFO.Chart.Space.Series.Confirmed').subscribe(v => this.labelConfirmed = v)
    this.translate.get('DAY_INFO.Chart.Space.Series.Unconfirmed').subscribe(v => this.labelUnconfirmed = v)
    this.translate.get('DAY_INFO.Chart.Space.Series.Available').subscribe(v => this.labelAvailable = v)
  }

  reloading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  data: DayInfo[] = []

  labelDeactivated = ""
  labelConfirmed = ""
  labelUnconfirmed = ""
  labelAvailable = ""


  private getDefaultDayInfo(): Observable<DayInfo[]> {
    return super.get('day/info')
  }

  private selectDayInfo(request: DateRangeSelectionRequest): Observable<DayInfo[]> {
    return super.post('day/info', request)
  }

  loadDayInfo(date: string): Observable<DayInfo> {
    return super.get('day/info/' + date)
  }

  loadDefaultDayInfo() {
    if (this.reloading.value) return
    this.reloading.next(true)
    this.getDefaultDayInfo().subscribe(d => this.handleData(d))
  }

  loadRangeDayInfo(start: Date, end: Date) {
    if (this.reloading.value) return
    this.reloading.next(true)
    this.selectDayInfo(new DateRangeSelectionRequest(start.toISOString(), end.toISOString())).subscribe(d => this.handleData(d))
  }

  loadRangeDayInfoString(from: string, to: string) {
    if (this.reloading.value) return
    this.reloading.next(true)
    this.selectDayInfo(new DateRangeSelectionRequest(from, to)).subscribe(d => this.handleData(d))
  }

  private handleData(d: DayInfo[]) {
    this.data = d
    this.reloading.next(false)
  }

  selected: OfferSelectionEntry[] = []
  primarySelected: OfferSelectionEntry | null = null

  selectionAddDayInfo(data: DayInfo) {
    let index = this.selected.findIndex(s => s.date == data.date)
    if (index >= 0) return
    let entry = new OfferSelectionEntry(data.date, undefined);
    this.selected.push(entry)
    if (!this.primarySelected) this.primarySelected = entry
  }

  selectionAddDayInfoOffer(day: DayInfo, offer: DayInfoOffer) {
    let dayIndex = this.selected.findIndex(s => s.date == day.date && s.offer == undefined)
    if (dayIndex >= 0) {
      this.selectionRemoveDayInfo(day)
    }

    let offerIndex = this.selected.findIndex(s => s.offer == offer.offer)
    if (offerIndex >= 0) return
    let entry = new OfferSelectionEntry(day.date, offer.offer)
    this.selected.push(entry)
    if (!this.primarySelected) this.primarySelected = entry
  }

  selectionRemoveDayInfo(day: DayInfo) {
    let index = this.selected.findIndex(s => s.date == day.date && s.offer == undefined)
    if (index < 0) return

    let entry = this.selected[index]
    this.removeSelected(entry)
  }

  changePrimarySelected(entry: OfferSelectionEntry) {
    if (this.primarySelected == entry) return

    let index = this.selected.indexOf(entry)
    if (index < 0) return

    this.primarySelected = entry
  }


  removeSelected(entry: OfferSelectionEntry) {
    let index = this.selected.indexOf(entry)
    if (index < 0) return

    this.selected.splice(index, 1)

    if (this.primarySelected == entry) {
      this.primarySelected = (this.selected.length > 0) ? this.selected[0] : null
    } else if (this.selected.length <= 0) {
      this.primarySelected = null
    }
  }


  createDayInfoChart(info: DayInfo): EChartsOption {
    let label = [
      this.labelDeactivated,
      this.labelConfirmed,
      this.labelUnconfirmed,
      this.labelAvailable
    ]

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      animation: false,
      legend: {
        data: label,
        bottom: 10,
        left: 'center',
      },
      xAxis: {
        type: 'category',
        data: info.offer.map(i => i.offer.start.substring(11, 16))
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: this.labelConfirmed,
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data: info.offer.map(i => DayInfoHelper.getSpaceConfirmed(i)),
          color: "#ee6666"
        }, {
          name: this.labelUnconfirmed,
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data: info.offer.map(i => DayInfoHelper.getSpaceUnconfirmed(i)),
          color: "#fac858"
        }, {
          name: this.labelDeactivated,
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data: info.offer.map(i => (!i.offer.active) ? i.offer.maxPersons : 0),
          color: "lightgrey"
        },
        {
          name: this.labelAvailable,
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          data: info.offer.map(i => DayInfoHelper.getSpaceAvailable(i)),
          color: "#91cc75"
        }
      ]
    }
  }


}
