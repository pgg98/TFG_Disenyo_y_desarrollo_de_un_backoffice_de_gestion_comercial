export class StatusColumnTable {
  status: string;
  color: string;
  message: string;

  constructor(
    status: string,
    color: string,
    message?: string
  ) {
    this.status = status;
    this.color = color;
    this.message = message;
  }
}
