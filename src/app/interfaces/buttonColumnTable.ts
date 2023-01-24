export class ButtonColumnTable {
  title: string;
  disabled: boolean;
  hidden: boolean;

  constructor(
    title: string,
    disabled: boolean = false,
    hidden: boolean = false
  ) {
    this.title = title;
    this.disabled = disabled;
    this.hidden = hidden;
  }
}
