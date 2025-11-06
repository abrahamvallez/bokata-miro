// Test for new markdown format (user's format)
import { describe, it, expect } from 'vitest';
import { parseMarkdown, parseStepsOverview, parseIncrements, extractTableStructure } from './markdownParser';

describe('Markdown Parser - New Format Support', () => {
  const newFormatMarkdown = `### Feature 1: User Pastes Markdown in Sidebar

#### Steps Overview

| Step # | Name | Layer | Increments | Effort Range |
|--------|------|-------|-----------|--------------|
| 1.1 | Sidebar Text Input Component | UI | 6 | 1-2 days |
| 1.2 | Text Validation & Error Display | UI/Logic | 5 | 1-2 days |
| 1.3 | Submit & Trigger Pipeline | UI/Integration | 4 | 1 day |

#### Step 1.1: Sidebar Text Input Component

**Scope:** Create textarea in sidebar, handle basic input, display placeholder
**Quality Attributes:** Mobile-responsive, clear UX, proper Miro sidebar integration

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| 1.1.1 ⭐ | Basic textarea in Miro sidebar | 1/5 | 5/5 | 1/5 | Minimal→Enhanced | Proves input collection works |
| 1.1.2 | Placeholder text with example | 1/5 | 4/5 | 1/5 | None→Helpful | Guide users on format |
| 1.1.3 | Syntax highlighting for markdown | 3/5 | 3/5 | 2/5 | Plain→Highlighted | Better UX for markdown editing |

#### Step 1.2: Text Validation & Error Display

**Scope:** Validate markdown structure, detect malformed tables, show error messages
**Quality Attributes:** Clear error messages, real-time feedback, helpful suggestions

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| 1.2.1 ⭐ | Basic check for markdown table presence | 1/5 | 4/5 | 1/5 | None→Basic | Fail fast on invalid input |
| 1.2.2 | Validate table column count | 2/5 | 3/5 | 1/5 | Permissive→Strict | Ensure consistent structure |

#### Step 1.3: Submit & Trigger Pipeline

**Scope:** Submit button, trigger parsing, show progress feedback
**Quality Attributes:** Clear action, feedback during processing, error recovery

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| 1.3.1 ⭐ | Submit button that triggers parsing | 1/5 | 5/5 | 1/5 | Manual→Triggered | Entry point to full pipeline |
| 1.3.2 | Loading indicator during processing | 2/5 | 3/5 | 1/5 | None→Visible | User knows something happening |
`;

  describe('Full parsing with new format', () => {
    it('should parse steps from new format', () => {
      // GIVEN: markdown with "Step #" column header
      const tables = extractTableStructure(newFormatMarkdown);
      console.log('\n--- Full parsing debug ---');
      console.log('Tables extracted:', tables.length);
      tables.forEach((table, i) => {
        const firstLine = table.split('\n')[0];
        console.log(`Table ${i} first line:`, firstLine);
      });

      const result = parseMarkdown(newFormatMarkdown);
      console.log('Steps found:', result.steps.length);
      console.log('Increments found:', result.increments.length);
      console.log('Steps:', JSON.stringify(result.steps, null, 2));

      // THEN: steps are detected
      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.steps.length).toBe(3);

      // Verify step IDs
      expect(result.steps[0].id).toBe('1.1');
      expect(result.steps[1].id).toBe('1.2');
      expect(result.steps[2].id).toBe('1.3');

      // Verify step names
      expect(result.steps[0].name).toBe('Sidebar Text Input Component');
      expect(result.steps[1].name).toBe('Text Validation & Error Display');
      expect(result.steps[2].name).toBe('Submit & Trigger Pipeline');
    });

    it('should parse increments from new format', () => {
      // GIVEN: markdown with separate ID and title columns
      const result = parseMarkdown(newFormatMarkdown);

      // THEN: increments are detected
      expect(result.increments.length).toBeGreaterThan(0);
      expect(result.increments.length).toBe(7); // 3 + 2 + 2 from the example

      // Verify first increment
      expect(result.increments[0].id).toBe('1.1.1');
      expect(result.increments[0].title).toBe('Basic textarea in Miro sidebar');
      expect(result.increments[0].stepId).toBe('1.1');

      // Verify emoji is removed
      expect(result.increments[0].title).not.toContain('⭐');
    });

    it('should link increments to correct steps', () => {
      // GIVEN: full markdown
      const result = parseMarkdown(newFormatMarkdown);

      // THEN: increments are linked to correct steps
      const step1Increments = result.increments.filter(inc => inc.stepId === '1.1');
      const step2Increments = result.increments.filter(inc => inc.stepId === '1.2');
      const step3Increments = result.increments.filter(inc => inc.stepId === '1.3');

      expect(step1Increments.length).toBe(3);
      expect(step2Increments.length).toBe(2);
      expect(step3Increments.length).toBe(2);
    });
  });

  describe('Steps table with "Step #" header', () => {
    it('should parse step # column correctly', () => {
      // GIVEN: table with "Step #" header
      const tableString = `| Step # | Name | Layer | Increments | Effort Range |
|--------|------|-------|-----------|--------------|
| 1.1 | Sidebar Text Input Component | UI | 6 | 1-2 days |
| 1.2 | Text Validation & Error Display | UI/Logic | 5 | 1-2 days |`;

      // WHEN: parsing steps
      const steps = parseStepsOverview(tableString);

      // THEN: steps are extracted
      expect(steps.length).toBe(2);
      expect(steps[0].id).toBe('1.1');
      expect(steps[0].name).toBe('Sidebar Text Input Component');
      expect(steps[1].id).toBe('1.2');
    });
  });

  describe('Increments table with separate ID column', () => {
    it('should parse ID and title from separate columns', () => {
      // GIVEN: table with ID in first column, title in second
      const tableString = `| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| 1.1.1 ⭐ | Basic textarea in Miro sidebar | 1/5 | 5/5 | 1/5 | Minimal→Enhanced | Proves input collection works |
| 1.1.2 | Placeholder text with example | 1/5 | 4/5 | 1/5 | None→Helpful | Guide users on format |`;

      // WHEN: parsing increments
      const increments = parseIncrements(tableString, '1.1');

      // THEN: increments are extracted
      expect(increments.length).toBe(2);
      expect(increments[0].id).toBe('1.1.1');
      expect(increments[0].title).toBe('Basic textarea in Miro sidebar');
      expect(increments[0].stepId).toBe('1.1');

      // Emoji should be removed
      expect(increments[0].title).not.toContain('⭐');
    });

    it('should handle increments with and without emojis', () => {
      // GIVEN: mixed format
      const tableString = `| # | Increment | Effort |
|----|-----------|--------|
| 1.1.1 ⭐ | With star emoji | 1/5 |
| 1.1.2 | Without emoji | 1/5 |`;

      // WHEN: parsing
      const increments = parseIncrements(tableString, '1.1');

      // THEN: both are parsed correctly
      expect(increments.length).toBe(2);
      expect(increments[0].id).toBe('1.1.1');
      expect(increments[1].id).toBe('1.1.2');
      expect(increments[0].title).not.toContain('⭐');
    });
  });

  describe('Backward compatibility', () => {
    it('should still parse original format', () => {
      // GIVEN: original format
      const originalMarkdown = `| # | Step ID | Name | Layer |
|---|---------|------|-------|
| 1 | 1.1 | Test Step | UI |

| # | Increment | Effort | Value | Risk |
|---|-----------|--------|-------|------|
| 1 | **1.1.1** - Test increment | 1/5 | 5/5 | 1/5 |`;

      // WHEN: parsing
      const result = parseMarkdown(originalMarkdown);

      // THEN: still works
      expect(result.steps.length).toBeGreaterThan(0);
      expect(result.increments.length).toBeGreaterThan(0);
    });
  });
});
