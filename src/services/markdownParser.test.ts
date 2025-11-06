// Unit tests for markdown parser service
// Increments 2.1.1, 2.2.1, 2.3.1

import { describe, it, expect } from 'vitest';
import {
  extractTableStructure,
  parseStepsOverview,
  parseIncrements,
  parseMarkdown,
} from './markdownParser';

describe('Markdown Parser - 2.1.1, 2.2.1, 2.3.1', () => {
  describe('extractTableStructure - 2.1.1', () => {
    it('should extract single table', () => {
      // GIVEN: markdown contains one pipe-delimited table
      const markdown = `# Title

| # | Step ID | Name |
|---|---------|------|
| 1 | 1.1 | Test |

Some text after.`;

      // WHEN: parser runs extractTableStructure()
      const tables = extractTableStructure(markdown);

      // THEN: returns array with one table object containing all rows
      expect(tables).toHaveLength(1);
      expect(tables[0]).toContain('| # | Step ID | Name |');
      expect(tables[0]).toContain('| 1 | 1.1 | Test |');
    });

    it('should extract multiple tables', () => {
      // GIVEN: markdown contains steps table + 3 increment tables
      const markdown = `
| # | Step ID | Name |
|---|---------|------|
| 1 | 1.1 | Test |

Text between tables.

| # | Increment | Effort |
|---|-----------|--------|
| 1 | 1.1.1 - Test | 1/5 |

| # | Increment | Effort |
|---|-----------|--------|
| 1 | 1.2.1 - Test | 2/5 |

| # | Increment | Effort |
|---|-----------|--------|
| 1 | 2.1.1 - Test | 3/5 |
`;

      // WHEN: parser runs extractTableStructure()
      const tables = extractTableStructure(markdown);

      // THEN: returns array with 4 table objects in correct order
      expect(tables).toHaveLength(4);
    });

    it('should return empty array for invalid markdown', () => {
      // GIVEN: markdown contains text with random pipes but no valid tables
      const markdown = 'This | has | pipes but no table structure';

      // WHEN: parser runs extractTableStructure()
      const tables = extractTableStructure(markdown);

      // THEN: returns empty array (no crash, no error thrown)
      expect(tables).toHaveLength(0);
      expect(tables).toEqual([]);
    });

    it('should handle empty markdown', () => {
      // GIVEN: empty markdown
      const markdown = '';

      // WHEN: parser runs
      const tables = extractTableStructure(markdown);

      // THEN: returns empty array
      expect(tables).toHaveLength(0);
    });

    it('should ignore incomplete tables', () => {
      // GIVEN: markdown with incomplete table (no separator)
      const markdown = `
| # | Step | Name |
| 1 | 1.1 | Test |
`;

      // WHEN: parser runs
      const tables = extractTableStructure(markdown);

      // THEN: returns empty array
      expect(tables).toHaveLength(0);
    });
  });

  describe('parseStepsOverview - 2.2.1', () => {
    it('should parse steps from overview table', () => {
      // GIVEN: markdown contains steps overview table with columns
      const tableString = `| # | Step ID | Name | Layer |
|---|---------|------|-------|
| 1 | 1.1 | Sidebar Text Input | UI |
| 2 | 1.2 | Input Validation | UI |`;

      // WHEN: parseStepsOverview() runs
      const steps = parseStepsOverview(tableString);

      // THEN: returns array of steps with { id, name } properties
      expect(steps).toHaveLength(2);
      expect(steps[0]).toHaveProperty('id');
      expect(steps[0]).toHaveProperty('name');
      expect(steps[1]).toHaveProperty('id');
      expect(steps[1]).toHaveProperty('name');
    });

    it('should extract correct step IDs', () => {
      // GIVEN: steps table contains specific step IDs
      const tableString = `| # | Step ID | Name | Layer |
|---|---------|------|-------|
| 1 | 1.1 | Test 1 | UI |
| 2 | 1.2 | Test 2 | Logic |
| 3 | 2.1 | Test 3 | Integration |`;

      // WHEN: parseStepsOverview() parses step IDs
      const steps = parseStepsOverview(tableString);

      // THEN: steps array contains matching IDs
      expect(steps.map(s => s.id)).toEqual(['1.1', '1.2', '2.1']);
    });

    it('should extract correct step names', () => {
      // GIVEN: steps table contains step names
      const tableString = `| # | Step ID | Name | Layer |
|---|---------|------|-------|
| 1 | 1.1 | Sidebar Text Input | UI |
| 2 | 1.2 | Input Validation | UI |`;

      // WHEN: parseStepsOverview() parses names
      const steps = parseStepsOverview(tableString);

      // THEN: each step object has correct name property (not empty)
      expect(steps[0].name).toBe('Sidebar Text Input');
      expect(steps[1].name).toBe('Input Validation');
      expect(steps[0].name).not.toBe('');
      expect(steps[1].name).not.toBe('');
    });

    it('should handle empty table', () => {
      // GIVEN: table with only header and separator
      const tableString = `| # | Step ID | Name | Layer |
|---|---------|------|-------|`;

      // WHEN: parser runs
      const steps = parseStepsOverview(tableString);

      // THEN: returns empty array
      expect(steps).toHaveLength(0);
    });

    it('should skip malformed rows', () => {
      // GIVEN: table with some malformed rows
      const tableString = `| # | Step ID | Name | Layer |
|---|---------|------|-------|
| 1 | 1.1 | Valid Step | UI |
| incomplete row
| 2 | 1.2 | Another Valid | Logic |`;

      // WHEN: parser runs
      const steps = parseStepsOverview(tableString);

      // THEN: only valid rows are parsed
      expect(steps.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('parseIncrements - 2.3.1', () => {
    it('should parse increments from increment table', () => {
      // GIVEN: markdown contains increment table
      const tableString = `| # | Increment | Effort | Value | Risk |
|---|-----------|--------|-------|------|
| 1 | **1.1.1** - Basic textarea in Miro sidebar | 1/5 | 5/5 | 1/5 |
| 2 | **1.1.2** - Add syntax highlighting | 2/5 | 3/5 | 2/5 |`;

      // WHEN: parseIncrements() runs
      const increments = parseIncrements(tableString, '1.1');

      // THEN: returns array of increments with { id, title, stepId }
      expect(increments).toHaveLength(2);
      expect(increments[0]).toHaveProperty('id');
      expect(increments[0]).toHaveProperty('title');
      expect(increments[0]).toHaveProperty('stepId');
    });

    it('should link increments to parent step', () => {
      // GIVEN: increment table belongs to step "1.1"
      const tableString = `| # | Increment | Effort | Value | Risk |
|---|-----------|--------|-------|------|
| 1 | **1.1.1** - Test increment | 1/5 | 5/5 | 1/5 |`;

      // WHEN: parseIncrements() processes this table
      const increments = parseIncrements(tableString, '1.1');

      // THEN: all increments have stepId = "1.1"
      expect(increments[0].stepId).toBe('1.1');
    });

    it('should extract increment IDs correctly', () => {
      // GIVEN: table with various increment formats
      const tableString = `| # | Increment | Effort | Value | Risk |
|---|-----------|--------|-------|------|
| 1 | **1.1.1** - First increment | 1/5 | 5/5 | 1/5 |
| 2 | 1.1.2 - Second increment | 2/5 | 4/5 | 2/5 |
| 3 | **1.1.3** Test without dash | 1/5 | 3/5 | 1/5 |`;

      // WHEN: parser runs
      const increments = parseIncrements(tableString, '1.1');

      // THEN: IDs are extracted correctly
      expect(increments[0].id).toBe('1.1.1');
      expect(increments[1].id).toBe('1.1.2');
      expect(increments[2].id).toBe('1.1.3');
    });

    it('should extract increment titles correctly', () => {
      // GIVEN: increments with titles
      const tableString = `| # | Increment | Effort | Value | Risk |
|---|-----------|--------|-------|------|
| 1 | **1.1.1** - Basic textarea in Miro sidebar | 1/5 | 5/5 | 1/5 |`;

      // WHEN: parser runs
      const increments = parseIncrements(tableString, '1.1');

      // THEN: title is extracted without ID prefix
      expect(increments[0].title).toBe('Basic textarea in Miro sidebar');
      expect(increments[0].title).not.toContain('1.1.1');
      expect(increments[0].title).not.toContain('**');
    });

    it('should handle empty table', () => {
      // GIVEN: empty increment table
      const tableString = `| # | Increment | Effort | Value | Risk |
|---|-----------|--------|-------|------|`;

      // WHEN: parser runs
      const increments = parseIncrements(tableString, '1.1');

      // THEN: returns empty array
      expect(increments).toHaveLength(0);
    });
  });

  describe('parseMarkdown - Full integration', () => {
    it('should parse complete markdown with steps and increments', () => {
      // GIVEN: complete markdown with steps and increment tables
      const markdown = `
## Steps Overview

| # | Step ID | Name | Layer |
|---|---------|------|-------|
| 1 | 1.1 | Sidebar Text Input | UI |
| 2 | 1.2 | Input Validation | UI |

## Step 1.1: Sidebar Text Input

| # | Increment | Effort | Value | Risk |
|---|-----------|--------|-------|------|
| 1 | **1.1.1** - Basic textarea | 1/5 | 5/5 | 1/5 |
| 2 | **1.1.2** - Add highlighting | 2/5 | 3/5 | 2/5 |

## Step 1.2: Input Validation

| # | Increment | Effort | Value | Risk |
|---|-----------|--------|-------|------|
| 1 | **1.2.1** - Basic validation | 1/5 | 4/5 | 1/5 |
`;

      // WHEN: parseMarkdown runs
      const result = parseMarkdown(markdown);

      // THEN: returns steps and increments
      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.increments.length).toBeGreaterThan(0);
    });

    it('should return empty arrays for invalid markdown', () => {
      // GIVEN: markdown with no tables
      const markdown = 'Just some text without any tables';

      // WHEN: parser runs
      const result = parseMarkdown(markdown);

      // THEN: returns empty arrays
      expect(result.steps).toEqual([]);
      expect(result.increments).toEqual([]);
    });

    it('should collect all increments from all steps', () => {
      // GIVEN: markdown has 3 increment tables for different steps
      const markdown = `
| # | Step ID | Name |
|---|---------|------|
| 1 | 1.1 | Step 1 |
| 2 | 1.2 | Step 2 |
| 3 | 2.1 | Step 3 |

| # | Increment | Effort |
|---|-----------|--------|
| 1 | **1.1.1** - Test 1 | 1/5 |
| 2 | **1.1.2** - Test 2 | 1/5 |

| # | Increment | Effort |
|---|-----------|--------|
| 1 | **1.2.1** - Test 3 | 1/5 |

| # | Increment | Effort |
|---|-----------|--------|
| 1 | **2.1.1** - Test 4 | 1/5 |
| 2 | **2.1.2** - Test 5 | 1/5 |
`;

      // WHEN: parseMarkdown runs on all tables
      const result = parseMarkdown(markdown);

      // THEN: total increments returned = sum of all table rows
      expect(result.increments.length).toBe(5);
    });
  });
});
