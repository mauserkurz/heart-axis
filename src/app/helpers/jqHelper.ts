export class JqHelper {

  constructor () {}

  static popoverStart (): void {
    $('[data-toggle="popover"]').popover();
  }

  static popoverHide (): void {
    $('[data-toggle="popover"]').popover('hide');
  }
}
