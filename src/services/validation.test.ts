// Unit tests for validation service
// Increment 1.2.1 - Basic check for markdown table presence

import { describe, it, expect } from 'vitest';
import { validateMarkdown } from './validation';

describe('Markdown Validation - 1.2.1', () => {
  describe('Valid table passes validation', () => {
    it('should pass validation with pipe tables', () => {
      // GIVEN: markdown with pipe tables
      const markdown = `| # | Step | Name |
|---|------|------|
| 1 | 1.1 | Test |`;

      // WHEN: validation runs
      const result = validateMarkdown(markdown);

      // THEN: no error, validation passes
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should pass with multiple tables', () => {
      // GIVEN: markdown with multiple pipe tables
      const markdown = `
| # | Step ID | Name |
|---|---------|------|
| 1 | 1.1 | Test |

| # | Increment | Effort |
|---|-----------|--------|
| 1 | 1.1.1 - Test | 1/5 |
`;

      // WHEN: validation runs
      const result = validateMarkdown(markdown);

      // THEN: validation passes
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should pass with complex table structure', () => {
      // GIVEN: markdown with table containing various data
      const markdown = `## Steps Overview

| # | Step ID | Name | Layer |
|---|---------|------|-------|
| 1 | 1.1 | Sidebar Text Input | UI |
| 2 | 1.2 | Input Validation | UI |
`;

      // WHEN: validation runs
      const result = validateMarkdown(markdown);

      // THEN: validation passes
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('Missing table shows error', () => {
    it('should fail validation without pipe tables', () => {
      // GIVEN: markdown without tables
      const markdown = 'Just some text without tables';

      // WHEN: validation runs
      const result = validateMarkdown(markdown);

      // THEN: error shown, validation fails
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('table');
    });

    it('should fail with pipes but no table structure', () => {
      // GIVEN: text with pipes but not a table
      const markdown = 'This | has | pipes | but | no table structure';

      // WHEN: validation runs
      const result = validateMarkdown(markdown);

      // THEN: validation fails
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('table');
    });

    it('should fail with only header row', () => {
      // GIVEN: table with only header, no separator
      const markdown = '| # | Step | Name |';

      // WHEN: validation runs
      const result = validateMarkdown(markdown);

      // THEN: validation fails (needs separator row)
      expect(result.isValid).toBe(false);
    });
  });

  describe('Empty input shows error', () => {
    it('should fail with empty string', () => {
      // GIVEN: empty textarea
      const markdown = '';

      // WHEN: validation runs
      const result = validateMarkdown(markdown);

      // THEN: error message is shown
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('should fail with only whitespace', () => {
      // GIVEN: textarea with only spaces and newlines
      const markdown = '   \n\n   \n  ';

      // WHEN: validation runs
      const result = validateMarkdown(markdown);

      // THEN: error message is shown
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('should handle table with extra whitespace', () => {
      // GIVEN: table with lots of whitespace
      const markdown = `


| # | Step | Name |
|---|------|------|
| 1 | 1.1 | Test |


      `;

      // WHEN: validation runs
      const result = validateMarkdown(markdown);

      // THEN: validation passes
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle table with mixed line endings', () => {
      // GIVEN: table with \r\n line endings
      const markdown = '| # | Step | Name |\r\n|---|------|------|\r\n| 1 | 1.1 | Test |';

      // WHEN: validation runs
      const result = validateMarkdown(markdown);

      // THEN: validation passes
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });
});
