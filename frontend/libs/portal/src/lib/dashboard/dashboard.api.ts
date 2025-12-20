export interface DashboardEntry {
  date: string,
  start: string,
  end: string,
  offer: DashboardEntryOffer[]
}

export interface DashboardEntryOffer {
  start: string,
  spaceAvailable: number,
  spaceConfirmed: number,
  spaceUnconfirmed: number,
  spaceDeactivated: number
}

