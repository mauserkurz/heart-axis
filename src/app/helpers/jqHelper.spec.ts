import { JqHelper } from "./jqHelper";

describe('JqHelper', () => {
  describe('popoverStart method', () => {
    it ('should call popover and init popper plugin', () => {
      spyOn($.fn, 'popover');
      JqHelper.popoverStart();

      expect($).toBeDefined();
      expect($.fn.popover).toBeDefined();
      expect($.fn.popover).toHaveBeenCalled();
    });
  });

  describe('popoverHide method', () => {
    it ('should call popover with hide argument and remove poppers balloons', () => {
      spyOn($.fn, 'popover');
      JqHelper.popoverHide();

      expect($).toBeDefined();
      expect($.fn.popover).toBeDefined();
      expect($.fn.popover).toHaveBeenCalledWith('hide');
    });
  });
});