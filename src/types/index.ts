// Type definitions for Miro Feature Breakdown Visualizer

export interface Step {
  id: string; // e.g., "1.1", "1.2"
  name: string; // e.g., "Sidebar Text Input"
}

export interface Increment {
  id: string; // e.g., "1.1.1", "1.2.1"
  title: string; // e.g., "Basic textarea in Miro sidebar"
  stepId: string; // Parent step ID, e.g., "1.1"
}

export interface GridPosition {
  row: number;
  column: number;
}

export interface PositionedIncrement extends Increment {
  position: GridPosition;
}

export interface GridDimensions {
  rows: number;
  columns: number;
}

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export interface ParsedMarkdown {
  steps: Step[];
  increments: Increment[];
}

export interface StickyNoteData {
  content: string;
  position?: { x: number; y: number };
  type?: 'step-header' | 'increment'; // Type of sticky
}

export interface BoardItem {
  content: string;
  x: number;
  y: number;
  type: 'step-header' | 'increment';
}
