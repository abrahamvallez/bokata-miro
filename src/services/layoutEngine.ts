// Grid layout calculation engine
// Increment 4.2.1 - Map each increment to grid cell

import { Step, Increment, GridDimensions, PositionedIncrement, GridPosition, BoardItem } from '../types';

// Grid configuration
const CELL_WIDTH = 300; // Width of each grid cell in pixels
const CELL_HEIGHT = 200; // Height of each grid cell in pixels
const GRID_PADDING = 50; // Padding between cells
const HEADER_COLUMN_OFFSET = -350; // X offset for step header column (to the left)
const TITLE_Y_OFFSET = -250; // Y offset for feature title (above the grid)
const START_X = 0; // Starting X position for increments
const START_Y = 0; // Starting Y position

/**
 * Calculate grid dimensions based on steps and increments
 * Rows = number of steps
 * Columns = max increments per step
 * @param steps Array of steps
 * @param increments Array of increments
 * @returns GridDimensions object
 */
export function calculateGridDimensions(steps: Step[], increments: Increment[]): GridDimensions {
  const rows = steps.length;

  // Calculate max increments per step
  let maxColumns = 0;

  for (const step of steps) {
    const stepIncrements = increments.filter(inc => inc.stepId === step.id);
    maxColumns = Math.max(maxColumns, stepIncrements.length);
  }

  return {
    rows,
    columns: maxColumns,
  };
}

/**
 * Map increments to grid positions
 * @param steps Array of steps
 * @param increments Array of increments
 * @param gridDims Grid dimensions
 * @returns Array of increments with grid positions
 */
export function mapIncrementsToGrid(
  steps: Step[],
  increments: Increment[],
  gridDims: GridDimensions
): PositionedIncrement[] {
  const positioned: PositionedIncrement[] = [];

  // Process each step (row)
  steps.forEach((step, rowIndex) => {
    const stepIncrements = increments.filter(inc => inc.stepId === step.id);

    // Sort increments by ID to ensure consistent ordering
    stepIncrements.sort((a, b) => a.id.localeCompare(b.id));

    // Map each increment to a column
    stepIncrements.forEach((increment, colIndex) => {
      positioned.push({
        ...increment,
        position: {
          row: rowIndex,
          column: colIndex,
        },
      });
    });
  });

  return positioned;
}

/**
 * Convert grid position to pixel coordinates
 * @param gridPosition Grid position (row, column)
 * @returns Pixel coordinates { x, y }
 */
export function gridToPixelCoordinates(gridPosition: GridPosition): { x: number; y: number } {
  const x = START_X + gridPosition.column * (CELL_WIDTH + GRID_PADDING);
  const y = START_Y + gridPosition.row * (CELL_HEIGHT + GRID_PADDING);

  return { x, y };
}

/**
 * Calculate positions for all increments
 * @param steps Array of steps
 * @param increments Array of increments
 * @returns Array of increments with pixel positions
 */
export function calculatePositions(
  steps: Step[],
  increments: Increment[]
): Array<Increment & { x: number; y: number }> {
  const gridDims = calculateGridDimensions(steps, increments);
  const positioned = mapIncrementsToGrid(steps, increments, gridDims);

  return positioned.map(inc => {
    const coords = gridToPixelCoordinates(inc.position);
    return {
      ...inc,
      x: coords.x,
      y: coords.y,
    };
  });
}

/**
 * Calculate positions for step headers
 * Creates a sticky note for each step in the first column (to the left of increments)
 * @param steps Array of steps
 * @returns Array of step headers with positions
 */
export function calculateStepHeaderPositions(steps: Step[]): BoardItem[] {
  return steps.map((step, rowIndex) => {
    const y = START_Y + rowIndex * (CELL_HEIGHT + GRID_PADDING);

    return {
      content: `${step.id}\n${step.name}`,
      x: HEADER_COLUMN_OFFSET,
      y: y,
      type: 'step-header' as const,
    };
  });
}

/**
 * Calculate positions for all board items (feature title + step headers + increments)
 * @param featureTitle The feature title
 * @param steps Array of steps
 * @param increments Array of increments
 * @returns Array of all board items with positions and types
 */
export function calculateAllBoardItems(
  featureTitle: string,
  steps: Step[],
  increments: Increment[]
): BoardItem[] {
  const boardItems: BoardItem[] = [];

  // Add feature title at the top center
  boardItems.push({
    content: featureTitle,
    x: START_X,
    y: TITLE_Y_OFFSET,
    type: 'feature-title' as const,
  });

  // Add step headers
  const stepHeaders = calculateStepHeaderPositions(steps);
  boardItems.push(...stepHeaders);

  // Add increments
  const positionedIncrements = calculatePositions(steps, increments);
  const incrementItems: BoardItem[] = positionedIncrements.map(inc => ({
    content: `${inc.id} - ${inc.title}`,
    x: inc.x,
    y: inc.y,
    type: 'increment' as const,
  }));
  boardItems.push(...incrementItems);

  return boardItems;
}
