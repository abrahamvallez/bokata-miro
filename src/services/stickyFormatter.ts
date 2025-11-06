// Sticky note content formatter
// Increment 3.1.1 - Build sticky title from increment ID & name

import { Increment, StickyNoteData } from '../types';

const MAX_TITLE_LENGTH = 100;

/**
 * Format sticky note content from increment data
 * Format: "1.1.1 - Basic textarea in Miro sidebar"
 * @param increment The increment object
 * @returns Formatted string for sticky note
 */
export function formatStickyContent(increment: Increment): string {
  const content = `${increment.id} - ${increment.title}`;

  // Truncate if too long
  if (content.length > MAX_TITLE_LENGTH) {
    return content.substring(0, MAX_TITLE_LENGTH - 3) + '...';
  }

  return content;
}

/**
 * Convert increment to sticky note data
 * @param increment The increment object
 * @returns StickyNoteData object
 */
export function incrementToStickyData(increment: Increment): StickyNoteData {
  return {
    content: formatStickyContent(increment),
  };
}
