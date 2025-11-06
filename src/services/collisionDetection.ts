// Collision detection and empty space finding for Miro board elements
// Ensures elements don't overlap by finding available positions

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ExistingElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Default dimensions for sticky notes
const DEFAULT_STICKY_WIDTH = 250;
const DEFAULT_STICKY_HEIGHT = 150;
const COLLISION_PADDING = 50; // Extra padding to ensure clear separation

/**
 * Get all existing items on the Miro board
 * @returns Array of existing elements with their positions and dimensions
 */
export async function getExistingElements(): Promise<ExistingElement[]> {
  try {
    // Get all items on the board (sticky notes, frames, shapes, etc.)
    const items = await miro.board.get();

    return items.map(item => ({
      id: item.id,
      x: item.x || 0,
      y: item.y || 0,
      width: item.width || DEFAULT_STICKY_WIDTH,
      height: item.height || DEFAULT_STICKY_HEIGHT,
    }));
  } catch (error) {
    console.error('Error getting existing elements:', error);
    return [];
  }
}

/**
 * Check if two bounding boxes collide (with padding)
 * @param box1 First bounding box
 * @param box2 Second bounding box
 * @returns True if boxes collide
 */
export function doBoxesCollide(box1: BoundingBox, box2: BoundingBox): boolean {
  const box1Left = box1.x - (box1.width / 2) - COLLISION_PADDING;
  const box1Right = box1.x + (box1.width / 2) + COLLISION_PADDING;
  const box1Top = box1.y - (box1.height / 2) - COLLISION_PADDING;
  const box1Bottom = box1.y + (box1.height / 2) + COLLISION_PADDING;

  const box2Left = box2.x - (box2.width / 2) - COLLISION_PADDING;
  const box2Right = box2.x + (box2.width / 2) + COLLISION_PADDING;
  const box2Top = box2.y - (box2.height / 2) - COLLISION_PADDING;
  const box2Bottom = box2.y + (box2.height / 2) + COLLISION_PADDING;

  return !(
    box1Right < box2Left ||
    box1Left > box2Right ||
    box1Bottom < box2Top ||
    box1Top > box2Bottom
  );
}

/**
 * Check if a position collides with any existing elements
 * @param x X coordinate
 * @param y Y coordinate
 * @param width Width of the element
 * @param height Height of the element
 * @param existingElements Array of existing elements
 * @returns True if there's a collision
 */
export function hasCollision(
  x: number,
  y: number,
  width: number,
  height: number,
  existingElements: ExistingElement[]
): boolean {
  const newBox: BoundingBox = { x, y, width, height };

  for (const element of existingElements) {
    if (doBoxesCollide(newBox, element)) {
      return true;
    }
  }

  return false;
}

/**
 * Calculate bounding box that would contain all the elements to be created
 * @param items Array of items with positions (and optional width/height)
 * @returns Bounding box for all items
 */
export function calculateGroupBounds(
  items: Array<{ x: number; y: number; width?: number; height?: number }>
): BoundingBox {
  if (items.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const item of items) {
    const width = item.width || DEFAULT_STICKY_WIDTH;
    const height = item.height || DEFAULT_STICKY_HEIGHT;

    const left = item.x - width / 2;
    const right = item.x + width / 2;
    const top = item.y - height / 2;
    const bottom = item.y + height / 2;

    minX = Math.min(minX, left);
    minY = Math.min(minY, top);
    maxX = Math.max(maxX, right);
    maxY = Math.max(maxY, bottom);
  }

  return {
    x: (minX + maxX) / 2,
    y: (minY + maxY) / 2,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Find an empty position on the board for a group of elements
 * Uses a spiral search pattern starting from the original position
 * @param items Array of items with positions
 * @param existingElements Array of existing elements
 * @returns Offset to apply to all items { dx, dy }
 */
export function findEmptySpace(
  items: Array<{ x: number; y: number; width?: number; height?: number }>,
  existingElements: ExistingElement[]
): { dx: number; dy: number } {
  if (items.length === 0 || existingElements.length === 0) {
    return { dx: 0, dy: 0 };
  }

  const groupBounds = calculateGroupBounds(items);

  // Check if the original position is already free
  if (!hasCollision(groupBounds.x, groupBounds.y, groupBounds.width, groupBounds.height, existingElements)) {
    return { dx: 0, dy: 0 };
  }

  // Spiral search parameters
  const step = 400; // Distance to move in each step (adjust based on typical element size)
  const maxIterations = 100; // Maximum number of positions to try

  // Spiral search: right, down, left, up, then expand
  let x = groupBounds.x;
  let y = groupBounds.y;
  let direction = 0; // 0: right, 1: down, 2: left, 3: up
  let stepsInDirection = 1;
  let stepsTaken = 0;
  let iterationCount = 0;

  while (iterationCount < maxIterations) {
    // Move in current direction
    switch (direction) {
      case 0: // right
        x += step;
        break;
      case 1: // down
        y += step;
        break;
      case 2: // left
        x -= step;
        break;
      case 3: // up
        y -= step;
        break;
    }

    stepsTaken++;

    // Check if this position is free
    if (!hasCollision(x, y, groupBounds.width, groupBounds.height, existingElements)) {
      return {
        dx: x - groupBounds.x,
        dy: y - groupBounds.y,
      };
    }

    // Change direction if we've taken enough steps
    if (stepsTaken >= stepsInDirection) {
      stepsTaken = 0;
      direction = (direction + 1) % 4;

      // Increase steps in direction every two direction changes (after completing a "ring")
      if (direction === 0 || direction === 2) {
        stepsInDirection++;
      }
    }

    iterationCount++;
  }

  // If no empty space found after spiral search, place to the right with large offset
  console.warn('Could not find empty space in spiral search, placing far to the right');
  return {
    dx: 2000,
    dy: 0,
  };
}

/**
 * Check for collisions and adjust positions if necessary
 * @param items Array of items with positions
 * @returns Array of items with adjusted positions (if needed)
 */
export async function adjustPositionsForCollisions<T extends { x: number; y: number; width?: number; height?: number }>(
  items: T[]
): Promise<T[]> {
  if (items.length === 0) {
    return items;
  }

  try {
    // Get all existing elements on the board
    const existingElements = await getExistingElements();

    if (existingElements.length === 0) {
      // Board is empty, no need to adjust
      return items;
    }

    // Find empty space
    const offset = findEmptySpace(items, existingElements);

    // Apply offset to all items
    return items.map(item => ({
      ...item,
      x: item.x + offset.dx,
      y: item.y + offset.dy,
    }));
  } catch (error) {
    console.error('Error adjusting positions for collisions:', error);
    // Return original items if there's an error
    return items;
  }
}
