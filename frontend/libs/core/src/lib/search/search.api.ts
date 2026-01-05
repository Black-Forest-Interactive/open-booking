export interface SearchOperatorInfo {
  key: string,
  name: string,
  status: string,
  statistics: SearchOperatorStats
}

export interface SearchOperatorStats {
  total: number,
  successful: number,
  failed: number,
}
