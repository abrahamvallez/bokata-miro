import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Miro SDK globally
global.miro = {
  board: {
    createStickyNote: vi.fn(),
    viewport: {
      zoomTo: vi.fn(),
    },
  },
} as any;
