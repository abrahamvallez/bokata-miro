// Unit tests for sticky formatter service
// Increment 3.1.1 - Build sticky title from increment ID & name

import { describe, it, expect } from 'vitest';
import { formatStickyContent, incrementToStickyData } from './stickyFormatter';
import { Increment } from '../types';

describe('Sticky Formatter - 3.1.1', () => {
  describe('formatStickyContent', () => {
    it('should format sticky title correctly', () => {
      // GIVEN: increment object with ID and title
      const increment: Increment = {
        id: '1.1.1',
        title: 'Basic textarea in Miro sidebar',
        stepId: '1.1',
      };

      // WHEN: formatStickyContent() processes it
      const result = formatStickyContent(increment);

      // THEN: returns "1.1.1 - Basic textarea in Miro sidebar"
      expect(result).toBe('1.1.1 - Basic textarea in Miro sidebar');
    });

    it('should include ID and title with separator', () => {
      // GIVEN: simple increment
      const increment: Increment = {
        id: '2.1.1',
        title: 'Test title',
        stepId: '2.1',
      };

      // WHEN: formatter runs
      const result = formatStickyContent(increment);

      // THEN: contains ID, dash separator, and title
      expect(result).toContain('2.1.1');
      expect(result).toContain(' - ');
      expect(result).toContain('Test title');
    });

    it('should truncate long titles', () => {
      // GIVEN: increment with very long title (> 100 chars)
      const longTitle = 'A'.repeat(150);
      const increment: Increment = {
        id: '1.1.1',
        title: longTitle,
        stepId: '1.1',
      };

      // WHEN: formatStickyContent() processes it
      const result = formatStickyContent(increment);

      // THEN: returns truncated string with "..." at end, length <= 100 chars
      expect(result.length).toBeLessThanOrEqual(100);
      expect(result).toContain('...');
      expect(result).toContain('1.1.1');
    });

    it('should not truncate normal length titles', () => {
      // GIVEN: increment with normal title
      const increment: Increment = {
        id: '1.1.1',
        title: 'Normal length title',
        stepId: '1.1',
      };

      // WHEN: formatter runs
      const result = formatStickyContent(increment);

      // THEN: no truncation occurs
      expect(result).not.toContain('...');
      expect(result).toBe('1.1.1 - Normal length title');
    });

    it('should handle title at exactly 100 chars boundary', () => {
      // GIVEN: increment with title that results in exactly 100 chars
      // "1.1.1 - " = 8 chars, so title should be 92 chars for total of 100
      const exactTitle = 'B'.repeat(92);
      const increment: Increment = {
        id: '1.1.1',
        title: exactTitle,
        stepId: '1.1',
      };

      // WHEN: formatter runs
      const result = formatStickyContent(increment);

      // THEN: no truncation
      expect(result.length).toBe(100);
      expect(result).not.toContain('...');
    });
  });

  describe('incrementToStickyData', () => {
    it('should convert increment to sticky data object', () => {
      // GIVEN: increment object
      const increment: Increment = {
        id: '1.1.1',
        title: 'Test increment',
        stepId: '1.1',
      };

      // WHEN: incrementToStickyData runs
      const result = incrementToStickyData(increment);

      // THEN: returns StickyNoteData with content
      expect(result).toHaveProperty('content');
      expect(result.content).toBe('1.1.1 - Test increment');
    });

    it('should return valid sticky data structure', () => {
      // GIVEN: any increment
      const increment: Increment = {
        id: '2.2.2',
        title: 'Another test',
        stepId: '2.2',
      };

      // WHEN: converter runs
      const result = incrementToStickyData(increment);

      // THEN: has correct structure for Miro SDK
      expect(typeof result.content).toBe('string');
      expect(result.content.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty title', () => {
      // GIVEN: increment with empty title
      const increment: Increment = {
        id: '1.1.1',
        title: '',
        stepId: '1.1',
      };

      // WHEN: formatter runs
      const result = formatStickyContent(increment);

      // THEN: still includes ID and separator
      expect(result).toBe('1.1.1 - ');
    });

    it('should handle special characters in title', () => {
      // GIVEN: title with special characters
      const increment: Increment = {
        id: '1.1.1',
        title: 'Test & verify <HTML> "quotes" \'apostrophes\'',
        stepId: '1.1',
      };

      // WHEN: formatter runs
      const result = formatStickyContent(increment);

      // THEN: special characters are preserved
      expect(result).toContain('&');
      expect(result).toContain('<HTML>');
      expect(result).toContain('"quotes"');
      expect(result).toContain("'apostrophes'");
    });

    it('should handle unicode characters', () => {
      // GIVEN: title with unicode
      const increment: Increment = {
        id: '1.1.1',
        title: 'Test with emoji 🎉 and unicode 你好',
        stepId: '1.1',
      };

      // WHEN: formatter runs
      const result = formatStickyContent(increment);

      // THEN: unicode is preserved
      expect(result).toContain('🎉');
      expect(result).toContain('你好');
    });

    it('should process all increments successfully', () => {
      // GIVEN: array of 10 increments
      const increments: Increment[] = Array.from({ length: 10 }, (_, i) => ({
        id: `1.${i}.1`,
        title: `Test increment ${i}`,
        stepId: `1.${i}`,
      }));

      // WHEN: formatStickyContent() processes all
      const results = increments.map(formatStickyContent);

      // THEN: all return non-empty strings, no nulls or undefined
      expect(results.length).toBe(10);
      results.forEach(result => {
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });
});
