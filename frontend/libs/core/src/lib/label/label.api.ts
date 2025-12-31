export interface Label {
  id: number,
  name: string,
  color: string,
  priority: number,
}

export class LabelChangeRequest {
  constructor(
    public name: string,
    public color: string,
    public priority: number,
  ) {
  }
}
