export class PagingSettings {
  constructor(
    public pageNumber: number = 0,
    public totalElements: number = 0,
    public pageSize: number = 20
  ) {
  }
}
