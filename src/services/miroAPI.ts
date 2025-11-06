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
 * @returns Created board item (sticky note or text)
 */
export async function createBoardItem(item: BoardItem): Promise<any> {
  // Handle feature title differently - create as text
  if (item.type === 'feature-title') {
    try {
      const text = await miro.board.createText({
        content: `<strong>${item.content}</strong>`,
        x: item.x,
        y: item.y,
        style: {
          fontSize: 32,
          textAlign: 'center',
        },
        width: 800, // Wide enough for title
      });
      return text;
    } catch (error) {
      console.error('Error creating feature title:', error);
      throw error;
    }
  }

  // Create sticky notes for step headers and increments
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
 * Create a frame that wraps all the board items
 * @param items Array of created board items
 * @param featureTitle Title for the frame
 * @returns Created frame object
 */
export async function createFrame(items: any[], featureTitle: string): Promise<any> {
  if (items.length === 0) return null;

  try {
    // Calculate bounds for all items
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const item of items) {
      const bounds = item;
      minX = Math.min(minX, bounds.x - (bounds.width || 250) / 2);
      minY = Math.min(minY, bounds.y - (bounds.height || 150) / 2);
      maxX = Math.max(maxX, bounds.x + (bounds.width || 250) / 2);
      maxY = Math.max(maxY, bounds.y + (bounds.height || 150) / 2);
    }

    // Add padding around the content
    const padding = 100;
    const frameWidth = maxX - minX + padding * 2;
    const frameHeight = maxY - minY + padding * 2;
    const frameX = (minX + maxX) / 2;
    const frameY = (minY + maxY) / 2;

    // Create the frame
    const frame = await miro.board.createFrame({
      title: featureTitle,
      x: frameX,
      y: frameY,
      width: frameWidth,
      height: frameHeight,
      style: {
        fillColor: '#ffffff',
      },
    });

    // Add all items to the frame
    for (const item of items) {
      try {
        await frame.add(item);
      } catch (err) {
        console.error('Error adding item to frame:', err);
      }
    }

    return frame;
  } catch (error) {
    console.error('Error creating frame:', error);
    throw error;
  }
}

/**
 * Zoom to fit all created stickies on the board
 * @param items Array of board item objects (can include frame)
 */
export async function zoomToStickies(items: any[]): Promise<void> {
  if (items.length === 0) return;

  try {
    await miro.board.viewport.zoomTo(items);
  } catch (error) {
    console.error('Error zooming to items:', error);
  }
}
