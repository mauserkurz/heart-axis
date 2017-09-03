import { fadeIn, slideInOut } from "./animations";

describe('animations', () => {
  describe('fadeIn animation', () => {
    it('should be defined', () => {
      expect(fadeIn).toBeDefined();
    });
  });
  describe('slideInOut animation', () => {
    it('should be defined', () => {
      expect(slideInOut).toBeDefined();
    });
  });
});