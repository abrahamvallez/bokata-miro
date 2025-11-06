// Unit tests for layout engine service
// Increment 4.2.1 - Map each increment to grid cell

import { describe, it, expect } from 'vitest';
import {
  calculateGridDimensions,
  mapIncrementsToGrid,
  gridToPixelCoordinates,
  calculatePositions,
  calculateStepHeaderPositions,
  calculateAllBoardItems,
} from './layoutEngine';
import { Step, Increment } from '../types';

describe('Layout Engine - 4.2.1', () => {
  describe('calculateGridDimensions', () => {
    it('should calculate correct dimensions for simple grid', () => {
      // GIVEN: 3 steps with max 5 increments per step
      const steps: Step[] = [
        { id: '1.1', name: 'Step 1' },
        { id: '1.2', name: 'Step 2' },
        { id: '2.1', name: 'Step 3' },
      ];

      const increments: Increment[] = [
        { id: '1.1.1', title: 'Inc 1', stepId: '1.1' },
        { id: '1.1.2', title: 'Inc 2', stepId: '1.1' },
        { id: '1.1.3', title: 'Inc 3', stepId: '1.1' },
        { id: '1.1.4', title: 'Inc 4', stepId: '1.1' },
        { id: '1.1.5', title: 'Inc 5', stepId: '1.1' }, // Max 5 in this step
        { id: '1.2.1', title: 'Inc 6', stepId: '1.2' },
        { id: '2.1.1', title: 'Inc 7', stepId: '2.1' },
      ];

      // WHEN: calculateGridDimensions() runs
      const result = calculateGridDimensions(steps, increments);

      // THEN: returns { rows: 3, columns: 5 }
      expect(result.rows).toBe(3);
      expect(result.columns).toBe(5);
    });

    it('should handle uniform distribution', () => {
      // GIVEN: 4 steps with 3 increments each
      const steps: Step[] = [
        { id: '1.1', name: 'Step 1' },
        { id: '1.2', name: 'Step 2' },
        { id: '2.1', name: 'Step 3' },
        { id: '2.2', name: 'Step 4' },
      ];

      const increments: Increment[] = [
        { id: '1.1.1', title: 'Inc 1', stepId: '1.1' },
        { id: '1.1.2', title: 'Inc 2', stepId: '1.1' },
        { id: '1.1.3', title: 'Inc 3', stepId: '1.1' },
        { id: '1.2.1', title: 'Inc 4', stepId: '1.2' },
        { id: '1.2.2', title: 'Inc 5', stepId: '1.2' },
        { id: '1.2.3', title: 'Inc 6', stepId: '1.2' },
        { id: '2.1.1', title: 'Inc 7', stepId: '2.1' },
        { id: '2.1.2', title: 'Inc 8', stepId: '2.1' },
        { id: '2.1.3', title: 'Inc 9', stepId: '2.1' },
        { id: '2.2.1', title: 'Inc 10', stepId: '2.2' },
        { id: '2.2.2', title: 'Inc 11', stepId: '2.2' },
        { id: '2.2.3', title: 'Inc 12', stepId: '2.2' },
      ];

      // WHEN: dimensions calculated
      const result = calculateGridDimensions(steps, increments);

      // THEN: rows = 4, columns = 3
      expect(result.rows).toBe(4);
      expect(result.columns).toBe(3);
    });

    it('should handle single increment', () => {
      // GIVEN: 1 step with 1 increment
      const steps: Step[] = [{ id: '1.1', name: 'Step 1' }];
      const increments: Increment[] = [
        { id: '1.1.1', title: 'Inc 1', stepId: '1.1' },
      ];

      // WHEN: dimensions calculated
      const result = calculateGridDimensions(steps, increments);

      // THEN: 1x1 grid
      expect(result.rows).toBe(1);
      expect(result.columns).toBe(1);
    });

    it('should handle empty increments', () => {
      // GIVEN: steps but no increments
      const steps: Step[] = [
        { id: '1.1', name: 'Step 1' },
        { id: '1.2', name: 'Step 2' },
      ];
      const increments: Increment[] = [];

      // WHEN: dimensions calculated
      const result = calculateGridDimensions(steps, increments);

      // THEN: rows = number of steps, columns = 0
      expect(result.rows).toBe(2);
      expect(result.columns).toBe(0);
    });
  });

  describe('mapIncrementsToGrid', () => {
    it('should map each increment to correct grid cell', () => {
      // GIVEN: increments array and calculated grid dimensions
      const steps: Step[] = [
        { id: '1.1', name: 'Step 1' },
        { id: '1.2', name: 'Step 2' },
      ];

      const increments: Increment[] = [
        { id: '1.1.1', title: 'Inc 1', stepId: '1.1' },
        { id: '1.1.2', title: 'Inc 2', stepId: '1.1' },
        { id: '1.2.1', title: 'Inc 3', stepId: '1.2' },
      ];

      const gridDims = { rows: 2, columns: 2 };

      // WHEN: mapIncrementsToGrid() runs
      const result = mapIncrementsToGrid(steps, increments, gridDims);

      // THEN: each increment has { row, column } properties with valid indices
      expect(result).toHaveLength(3);
      result.forEach(inc => {
        expect(inc).toHaveProperty('position');
        expect(inc.position).toHaveProperty('row');
        expect(inc.position).toHaveProperty('column');
        expect(typeof inc.position.row).toBe('number');
        expect(typeof inc.position.column).toBe('number');
      });
    });

    it('should not have overlapping positions', () => {
      // GIVEN: all increments mapped to grid cells
      const steps: Step[] = [
        { id: '1.1', name: 'Step 1' },
        { id: '1.2', name: 'Step 2' },
        { id: '2.1', name: 'Step 3' },
      ];

      const increments: Increment[] = [
        { id: '1.1.1', title: 'Inc 1', stepId: '1.1' },
        { id: '1.1.2', title: 'Inc 2', stepId: '1.1' },
        { id: '1.2.1', title: 'Inc 3', stepId: '1.2' },
        { id: '1.2.2', title: 'Inc 4', stepId: '1.2' },
        { id: '2.1.1', title: 'Inc 5', stepId: '2.1' },
      ];

      const gridDims = calculateGridDimensions(steps, increments);

      // WHEN: checking for duplicate [row, col] positions
      const result = mapIncrementsToGrid(steps, increments, gridDims);
      const positions = result.map(inc => `${inc.position.row},${inc.position.column}`);
      const uniquePositions = new Set(positions);

      // THEN: no two increments have same position (all unique)
      expect(uniquePositions.size).toBe(positions.length);
    });

    it('should assign increments to correct rows based on step', () => {
      // GIVEN: multiple steps
      const steps: Step[] = [
        { id: '1.1', name: 'Step 1' },
        { id: '1.2', name: 'Step 2' },
      ];

      const increments: Increment[] = [
        { id: '1.1.1', title: 'Inc 1', stepId: '1.1' },
        { id: '1.2.1', title: 'Inc 2', stepId: '1.2' },
      ];

      const gridDims = { rows: 2, columns: 1 };

      // WHEN: mapping to grid
      const result = mapIncrementsToGrid(steps, increments, gridDims);

      // THEN: step 1.1 increments in row 0, step 1.2 in row 1
      const step1Increments = result.filter(inc => inc.stepId === '1.1');
      const step2Increments = result.filter(inc => inc.stepId === '1.2');

      step1Increments.forEach(inc => expect(inc.position.row).toBe(0));
      step2Increments.forEach(inc => expect(inc.position.row).toBe(1));
    });

    it('should assign increments to sequential columns', () => {
      // GIVEN: step with multiple increments
      const steps: Step[] = [{ id: '1.1', name: 'Step 1' }];

      const increments: Increment[] = [
        { id: '1.1.1', title: 'Inc 1', stepId: '1.1' },
        { id: '1.1.2', title: 'Inc 2', stepId: '1.1' },
        { id: '1.1.3', title: 'Inc 3', stepId: '1.1' },
      ];

      const gridDims = { rows: 1, columns: 3 };

      // WHEN: mapping to grid
      const result = mapIncrementsToGrid(steps, increments, gridDims);

      // THEN: columns are 0, 1, 2
      expect(result[0].position.column).toBe(0);
      expect(result[1].position.column).toBe(1);
      expect(result[2].position.column).toBe(2);
    });
  });

  describe('gridToPixelCoordinates', () => {
    it('should convert grid position to pixel coordinates', () => {
      // GIVEN: grid position [0, 0]
      const position = { row: 0, column: 0 };

      // WHEN: converting to pixels
      const result = gridToPixelCoordinates(position);

      // THEN: returns start position
      expect(result).toHaveProperty('x');
      expect(result).toHaveProperty('y');
      expect(typeof result.x).toBe('number');
      expect(typeof result.y).toBe('number');
    });

    it('should calculate different positions for different cells', () => {
      // GIVEN: two different grid positions
      const pos1 = { row: 0, column: 0 };
      const pos2 = { row: 1, column: 1 };

      // WHEN: converting both
      const result1 = gridToPixelCoordinates(pos1);
      const result2 = gridToPixelCoordinates(pos2);

      // THEN: pixel coordinates are different
      expect(result1.x).not.toBe(result2.x);
      expect(result1.y).not.toBe(result2.y);
    });

    it('should maintain spacing between cells', () => {
      // GIVEN: adjacent cells
      const pos1 = { row: 0, column: 0 };
      const pos2 = { row: 0, column: 1 };

      // WHEN: converting to pixels
      const result1 = gridToPixelCoordinates(pos1);
      const result2 = gridToPixelCoordinates(pos2);

      // THEN: horizontal spacing is consistent (CELL_WIDTH + PADDING)
      const spacing = result2.x - result1.x;
      expect(spacing).toBeGreaterThan(0);
      expect(spacing).toBe(350); // 300 + 50 based on layoutEngine.ts constants
    });
  });

  describe('calculatePositions - Integration', () => {
    it('should calculate positions for all increments', () => {
      // GIVEN: steps and increments
      const steps: Step[] = [
        { id: '1.1', name: 'Step 1' },
        { id: '1.2', name: 'Step 2' },
      ];

      const increments: Increment[] = [
        { id: '1.1.1', title: 'Inc 1', stepId: '1.1' },
        { id: '1.1.2', title: 'Inc 2', stepId: '1.1' },
        { id: '1.2.1', title: 'Inc 3', stepId: '1.2' },
      ];

      // WHEN: calculatePositions runs
      const result = calculatePositions(steps, increments);

      // THEN: all increments have x and y coordinates
      expect(result).toHaveLength(3);
      result.forEach(inc => {
        expect(inc).toHaveProperty('x');
        expect(inc).toHaveProperty('y');
        expect(typeof inc.x).toBe('number');
        expect(typeof inc.y).toBe('number');
      });
    });

    it('should maintain original increment data', () => {
      // GIVEN: increments with data
      const steps: Step[] = [{ id: '1.1', name: 'Step 1' }];
      const increments: Increment[] = [
        { id: '1.1.1', title: 'Test increment', stepId: '1.1' },
      ];

      // WHEN: positions calculated
      const result = calculatePositions(steps, increments);

      // THEN: original data preserved
      expect(result[0].id).toBe('1.1.1');
      expect(result[0].title).toBe('Test increment');
      expect(result[0].stepId).toBe('1.1');
    });

    it('should ensure all stickies are positioned and visible', () => {
      // GIVEN: all stickies created and mapped to grid
      const steps: Step[] = [
        { id: '1.1', name: 'Step 1' },
        { id: '1.2', name: 'Step 2' },
        { id: '2.1', name: 'Step 3' },
      ];

      const increments: Increment[] = [
        { id: '1.1.1', title: 'Inc 1', stepId: '1.1' },
        { id: '1.1.2', title: 'Inc 2', stepId: '1.1' },
        { id: '1.2.1', title: 'Inc 3', stepId: '1.2' },
        { id: '2.1.1', title: 'Inc 4', stepId: '2.1' },
        { id: '2.1.2', title: 'Inc 5', stepId: '2.1' },
        { id: '2.1.3', title: 'Inc 6', stepId: '2.1' },
      ];

      // WHEN: positions calculated
      const result = calculatePositions(steps, increments);

      // THEN: all increments positioned, no gaps or empty cells
      expect(result.length).toBe(increments.length);

      // All positions should be non-negative
      result.forEach(inc => {
        expect(inc.x).toBeGreaterThanOrEqual(0);
        expect(inc.y).toBeGreaterThanOrEqual(0);
      });

      // Check for unique positions (no overlaps)
      const positions = result.map(inc => `${inc.x},${inc.y}`);
      const uniquePositions = new Set(positions);
      expect(uniquePositions.size).toBe(positions.length);
    });
  });

  describe('Step Header Positioning', () => {
    it('should calculate positions for step headers', () => {
      // GIVEN: steps
      const steps: Step[] = [
        { id: '1.1', name: 'Step 1' },
        { id: '1.2', name: 'Step 2' },
        { id: '2.1', name: 'Step 3' },
      ];

      // WHEN: calculating step header positions
      const headers = calculateStepHeaderPositions(steps);

      // THEN: headers created for each step
      expect(headers).toHaveLength(3);
      headers.forEach((header, index) => {
        expect(header.type).toBe('step-header');
        expect(header.content).toContain(steps[index].id);
        expect(header.content).toContain(steps[index].name);
        expect(header.x).toBeLessThan(0); // Headers are to the left
        expect(header.y).toBeGreaterThanOrEqual(0);
      });
    });

    it('should position headers vertically aligned with increments', () => {
      // GIVEN: steps
      const steps: Step[] = [
        { id: '1.1', name: 'Step 1' },
        { id: '1.2', name: 'Step 2' },
      ];

      // WHEN: calculating positions
      const headers = calculateStepHeaderPositions(steps);

      // THEN: headers have same y-spacing as grid
      const yDiff = headers[1].y - headers[0].y;
      expect(yDiff).toBe(250); // CELL_HEIGHT + GRID_PADDING = 200 + 50
    });
  });

  describe('calculateAllBoardItems', () => {
    it('should create both step headers and increments', () => {
      // GIVEN: steps and increments
      const steps: Step[] = [
        { id: '1.1', name: 'Step 1' },
        { id: '1.2', name: 'Step 2' },
      ];

      const increments: Increment[] = [
        { id: '1.1.1', title: 'Inc 1', stepId: '1.1' },
        { id: '1.1.2', title: 'Inc 2', stepId: '1.1' },
        { id: '1.2.1', title: 'Inc 3', stepId: '1.2' },
      ];

      // WHEN: calculating all board items
      const boardItems = calculateAllBoardItems(steps, increments);

      // THEN: contains both headers and increments
      expect(boardItems.length).toBe(5); // 2 headers + 3 increments

      const headers = boardItems.filter(item => item.type === 'step-header');
      const incs = boardItems.filter(item => item.type === 'increment');

      expect(headers).toHaveLength(2);
      expect(incs).toHaveLength(3);
    });

    it('should format content correctly for each type', () => {
      // GIVEN: data
      const steps: Step[] = [{ id: '1.1', name: 'Test Step' }];
      const increments: Increment[] = [
        { id: '1.1.1', title: 'Test Increment', stepId: '1.1' },
      ];

      // WHEN: creating board items
      const boardItems = calculateAllBoardItems(steps, increments);

      // THEN: content formatted correctly
      const header = boardItems.find(item => item.type === 'step-header');
      const increment = boardItems.find(item => item.type === 'increment');

      expect(header.content).toContain('1.1');
      expect(header.content).toContain('Test Step');

      expect(increment.content).toContain('1.1.1');
      expect(increment.content).toContain('Test Increment');
    });

    it('should position all items without overlaps', () => {
      // GIVEN: multiple steps and increments
      const steps: Step[] = [
        { id: '1.1', name: 'Step 1' },
        { id: '1.2', name: 'Step 2' },
      ];

      const increments: Increment[] = [
        { id: '1.1.1', title: 'Inc 1', stepId: '1.1' },
        { id: '1.2.1', title: 'Inc 2', stepId: '1.2' },
      ];

      // WHEN: calculating all positions
      const boardItems = calculateAllBoardItems(steps, increments);

      // THEN: no overlapping positions
      const positions = boardItems.map(item => `${item.x},${item.y}`);
      const uniquePositions = new Set(positions);

      expect(uniquePositions.size).toBe(positions.length);
    });
  });
});
