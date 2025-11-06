// Tests for collision detection and empty space finding
import { describe, it, expect } from 'vitest';
import {
  doBoxesCollide,
  hasCollision,
  calculateGroupBounds,
  findEmptySpace,
  type BoundingBox,
  type ExistingElement,
} from './collisionDetection';

describe('collisionDetection', () => {
  describe('doBoxesCollide', () => {
    it('should detect collision when boxes overlap', () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 100, height: 100 };
      const box2: BoundingBox = { x: 50, y: 50, width: 100, height: 100 };

      expect(doBoxesCollide(box1, box2)).toBe(true);
    });

    it('should detect no collision when boxes are far apart', () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 100, height: 100 };
      const box2: BoundingBox = { x: 500, y: 500, width: 100, height: 100 };

      expect(doBoxesCollide(box1, box2)).toBe(false);
    });

    it('should detect no collision when boxes are adjacent but not overlapping', () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 100, height: 100 };
      const box2: BoundingBox = { x: 300, y: 0, width: 100, height: 100 };

      // With COLLISION_PADDING of 50, these should not collide (300px apart)
      expect(doBoxesCollide(box1, box2)).toBe(false);
    });

    it('should detect collision when boxes touch considering padding', () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 100, height: 100 };
      const box2: BoundingBox = { x: 100, y: 0, width: 100, height: 100 };

      // With COLLISION_PADDING of 50, these should collide
      expect(doBoxesCollide(box1, box2)).toBe(true);
    });
  });

  describe('hasCollision', () => {
    const existingElements: ExistingElement[] = [
      { id: '1', x: 0, y: 0, width: 100, height: 100 },
      { id: '2', x: 300, y: 300, width: 100, height: 100 },
    ];

    it('should detect collision with existing element', () => {
      expect(hasCollision(50, 50, 100, 100, existingElements)).toBe(true);
    });

    it('should detect no collision in empty space', () => {
      expect(hasCollision(1000, 1000, 100, 100, existingElements)).toBe(false);
    });

    it('should detect no collision with empty elements array', () => {
      expect(hasCollision(0, 0, 100, 100, [])).toBe(false);
    });
  });

  describe('calculateGroupBounds', () => {
    it('should calculate bounds for a single item', () => {
      const items = [{ x: 0, y: 0, width: 100, height: 100 }];
      const bounds = calculateGroupBounds(items);

      expect(bounds).toEqual({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      });
    });

    it('should calculate bounds for multiple items', () => {
      const items = [
        { x: 0, y: 0, width: 100, height: 100 },
        { x: 200, y: 200, width: 100, height: 100 },
      ];
      const bounds = calculateGroupBounds(items);

      // The bounds should encompass both items
      // Item 1: left=-50, right=50, top=-50, bottom=50
      // Item 2: left=150, right=250, top=150, bottom=250
      // Total: width=250-(-50)=300, height=250-(-50)=300
      expect(bounds.x).toBe(100); // Center X
      expect(bounds.y).toBe(100); // Center Y
      expect(bounds.width).toBe(300); // Total width
      expect(bounds.height).toBe(300); // Total height
    });

    it('should handle items without explicit dimensions', () => {
      const items = [
        { x: 0, y: 0 },
        { x: 300, y: 200 },
      ];
      const bounds = calculateGroupBounds(items);

      // Should use default dimensions
      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should return zero bounds for empty items array', () => {
      const bounds = calculateGroupBounds([]);
      expect(bounds).toEqual({ x: 0, y: 0, width: 0, height: 0 });
    });
  });

  describe('findEmptySpace', () => {
    it('should return no offset when space is already empty', () => {
      const items = [{ x: 1000, y: 1000, width: 100, height: 100 }];
      const existingElements: ExistingElement[] = [
        { id: '1', x: 0, y: 0, width: 100, height: 100 },
      ];

      const offset = findEmptySpace(items, existingElements);
      expect(offset).toEqual({ dx: 0, dy: 0 });
    });

    it('should find offset when original position has collision', () => {
      const items = [{ x: 0, y: 0, width: 100, height: 100 }];
      const existingElements: ExistingElement[] = [
        { id: '1', x: 0, y: 0, width: 100, height: 100 },
      ];

      const offset = findEmptySpace(items, existingElements);

      // Should find a non-zero offset
      expect(offset.dx !== 0 || offset.dy !== 0).toBe(true);
    });

    it('should return zero offset for empty items', () => {
      const existingElements: ExistingElement[] = [
        { id: '1', x: 0, y: 0, width: 100, height: 100 },
      ];

      const offset = findEmptySpace([], existingElements);
      expect(offset).toEqual({ dx: 0, dy: 0 });
    });

    it('should return zero offset when no existing elements', () => {
      const items = [{ x: 0, y: 0, width: 100, height: 100 }];

      const offset = findEmptySpace(items, []);
      expect(offset).toEqual({ dx: 0, dy: 0 });
    });

    it('should handle multiple items as a group', () => {
      const items = [
        { x: 0, y: 0, width: 100, height: 100 },
        { x: 200, y: 0, width: 100, height: 100 },
      ];
      const existingElements: ExistingElement[] = [
        { id: '1', x: 0, y: 0, width: 100, height: 100 },
        { id: '2', x: 200, y: 0, width: 100, height: 100 },
      ];

      const offset = findEmptySpace(items, existingElements);

      // Should find a position where the entire group fits
      expect(offset.dx !== 0 || offset.dy !== 0).toBe(true);
    });
  });
});
