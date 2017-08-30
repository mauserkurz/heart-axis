export class JqHelper {
  constructor () {}

  static popoverStart (): void {
    if ($ && $.fn.popover) {
      $('[data-toggle="popover"]').popover();
    }
  }

  static popoverHide (): void {
    if ($ && $.fn.popover) {
      $('[data-toggle="popover"]').popover('hide');
    }
  }
}
