// Miro SDK wrapper service
// Increment 3.2.1 - Create sticky notes via SDK

import { Increment, BoardItem } from '../types';
import { formatStickyContent } from './stickyFormatter';

/**
 * Create a single sticky note on the Miro board
 * @param content The content for the sticky note
 * @param x X coordinate (optional)
 * @param y Y coordinate (optional)
 * @returns The created sticky note object from Miro SDK
 */
export async function createStickyNote(
  content: string,
  x?: number,
  y?: number
): Promise<any> {
  const config: any = {
    content,
  };

  if (x !== undefined && y !== undefined) {
    config.x = x;
    config.y = y;
  }

  try {
    const stickyNote = await miro.board.createStickyNote(config);
    return stickyNote;
  } catch (error) {
    console.error('Error creating sticky note:', error);
    throw error;
  }
}

/**
 * Create multiple sticky notes from increments
 * @param increments Array of increments with positions
 * @returns Array of created sticky note objects
 */
export async function createStickiesFromIncrements(
  increments: Array<Increment & { x: number; y: number }>
): Promise<any[]> {
  const stickies: any[] = [];

  for (const increment of increments) {
    const content = formatStickyContent(increment);
    const sticky = await createStickyNote(content, increment.x, increment.y);
    stickies.push(sticky);
  }

  return stickies;
}

/**
 * Create sticky note from board item with appropriate styling
 * @param item BoardItem with content, position, and type
 * @returns Created sticky note object
 */
export async function createBoardItem(item: BoardItem): Promise<any> {
  const config: any = {
    content: item.content,
    x: item.x,
    y: item.y,
  };

  // Style step headers differently (blue color for headers)
  if (item.type === 'step-header') {
    config.style = {
      fillColor: 'light_blue', // Light blue for step headers
    };
  } else {
    config.style = {
      fillColor: 'light_yellow', // Light yellow for increments
    };
  }

  try {
    const stickyNote = await miro.board.createStickyNote(config);
    return stickyNote;
  } catch (error) {
    console.error('Error creating board item:', error);
    throw error;
  }
}

/**
 * Create all board items (step headers + increments)
 * @param items Array of BoardItems
 * @returns Array of created sticky note objects
 */
export async function createAllBoardItems(items: BoardItem[]): Promise<any[]> {
  const stickies: any[] = [];

  for (const item of items) {
    const sticky = await createBoardItem(item);
    stickies.push(sticky);
  }

  return stickies;
}

/**
 * Zoom to fit all created stickies on the board
 * @param stickies Array of sticky note objects
 */
export async function zoomToStickies(stickies: any[]): Promise<void> {
  if (stickies.length === 0) return;

  try {
    await miro.board.viewport.zoomTo(stickies);
  } catch (error) {
    console.error('Error zooming to stickies:', error);
  }
}
