// Integration tests for full user journey
// Complete Walking Skeleton Pipeline

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateMarkdown } from '../services/validation';
import { parseMarkdown } from '../services/markdownParser';
import { calculatePositions } from '../services/layoutEngine';
import { formatStickyContent } from '../services/stickyFormatter';
import { createStickiesFromIncrements } from '../services/miroAPI';

// Mock Miro SDK for integration tests
const mockCreateStickyNote = vi.fn();
const mockZoomTo = vi.fn();

beforeEach(() => {
  mockCreateStickyNote.mockClear();
  mockZoomTo.mockClear();

  global.miro = {
    board: {
      createStickyNote: mockCreateStickyNote,
      viewport: {
        zoomTo: mockZoomTo,
      },
    },
  } as any;

  mockCreateStickyNote.mockResolvedValue({
    id: 'sticky-123',
    content: 'test',
    x: 0,
    y: 0,
  });
});

describe('Full Walking Skeleton Pipeline - Integration Tests', () => {
  const exampleMarkdown = `# Feature Breakdown Example

## Steps Overview

| # | Step ID | Name | Layer |
|---|---------|------|-------|
| 1 | 1.1 | Sidebar Text Input | UI |
| 2 | 1.2 | Input Validation | UI |
| 3 | 2.1 | Table Extraction | Logic |

## Step 1.1: Sidebar Text Input

| # | Increment | Effort | Value | Risk |
|---|-----------|--------|-------|------|
| 1 | **1.1.1** - Basic textarea in Miro sidebar | 1/5 | 5/5 | 1/5 |
| 2 | **1.1.2** - Add syntax highlighting | 2/5 | 3/5 | 2/5 |

## Step 1.2: Input Validation

| # | Increment | Effort | Value | Risk |
|---|-----------|--------|-------|------|
| 1 | **1.2.1** - Basic check for markdown table presence | 1/5 | 4/5 | 1/5 |
| 2 | **1.2.2** - Validate table structure | 2/5 | 4/5 | 2/5 |

## Step 2.1: Table Extraction

| # | Increment | Effort | Value | Risk |
|---|-----------|--------|-------|------|
| 1 | **2.1.1** - Simple regex to find pipe-delimited tables | 2/5 | 4/5 | 2/5 |
`;

  it('should complete paste → parse → create → position flow', async () => {
    // Phase 1: Paste & Validate
    // GIVEN: User with valid markdown
    const validation = validateMarkdown(exampleMarkdown);
    expect(validation.isValid).toBe(true);

    // Phase 2: Parse
    // WHEN: Parse → Extract steps and increments
    const { steps, increments } = parseMarkdown(exampleMarkdown);
    expect(steps.length).toBeGreaterThan(0);
    expect(increments.length).toBeGreaterThan(0);

    // Verify parsing results
    expect(steps).toHaveLength(3);
    expect(increments).toHaveLength(5);

    // Phase 3: Format & Create
    // WHEN: Format sticky content
    const stickyContents = increments.map(formatStickyContent);
    expect(stickyContents).toHaveLength(5);

    // Verify formatting
    stickyContents.forEach(content => {
      expect(content).toBeTruthy();
      expect(content).toMatch(/\d+\.\d+\.\d+ - .+/);
    });

    // Phase 4: Position in Grid
    // WHEN: Calculate positions for all increments
    const positionedIncrements = calculatePositions(steps, increments);
    expect(positionedIncrements).toHaveLength(5);

    // Verify all have positions
    positionedIncrements.forEach(inc => {
      expect(inc).toHaveProperty('x');
      expect(inc).toHaveProperty('y');
      expect(typeof inc.x).toBe('number');
      expect(typeof inc.y).toBe('number');
    });

    // Phase 5: Create stickies on board
    // WHEN: Create all stickies
    const stickies = await createStickiesFromIncrements(positionedIncrements);

    // THEN: All 5 increments complete successfully
    expect(stickies.length).toBe(5);
    expect(mockCreateStickyNote).toHaveBeenCalledTimes(5);

    // Verify Miro SDK was called with correct data
    const firstCall = mockCreateStickyNote.mock.calls[0][0];
    expect(firstCall).toHaveProperty('content');
    expect(firstCall.content).toContain('1.1.1');
    expect(firstCall.content).toContain('Basic textarea in Miro sidebar');
  });

  it('should handle invalid input with clear error message', () => {
    // GIVEN: User with invalid markdown
    const invalidMarkdown = 'Just some text without any tables';

    // WHEN: Validation runs
    const validation = validateMarkdown(invalidMarkdown);

    // THEN: Error message displays
    expect(validation.isValid).toBe(false);
    expect(validation.error).toBeTruthy();
    expect(validation.error).toContain('table');
  });

  it('should handle parsing errors gracefully', () => {
    // GIVEN: Markdown with table but wrong structure
    const malformedMarkdown = `
| # | Wrong | Headers |
|---|-------|---------|
| 1 | data | data |
`;

    // WHEN: Parsing runs
    const validation = validateMarkdown(malformedMarkdown);
    expect(validation.isValid).toBe(true); // Has table structure

    const result = parseMarkdown(malformedMarkdown);

    // THEN: Returns empty or minimal data, no crash
    expect(result).toHaveProperty('steps');
    expect(result).toHaveProperty('increments');
    // Should not crash, even if empty
    expect(Array.isArray(result.steps)).toBe(true);
    expect(Array.isArray(result.increments)).toBe(true);
  });

  it('should create unique positions for all stickies', () => {
    // GIVEN: Parsed markdown
    const { steps, increments } = parseMarkdown(exampleMarkdown);

    // WHEN: Calculating positions
    const positioned = calculatePositions(steps, increments);

    // THEN: No overlapping positions
    const positionStrings = positioned.map(inc => `${inc.x},${inc.y}`);
    const uniquePositions = new Set(positionStrings);

    expect(uniquePositions.size).toBe(positionStrings.length);
  });

  it('should preserve increment data through entire pipeline', () => {
    // GIVEN: Example markdown
    const { steps, increments } = parseMarkdown(exampleMarkdown);
    const firstIncrement = increments[0];

    // Track the first increment through the pipeline
    expect(firstIncrement.id).toBe('1.1.1');
    expect(firstIncrement.title).toContain('Basic textarea');

    // WHEN: Formatting
    const formatted = formatStickyContent(firstIncrement);
    expect(formatted).toContain('1.1.1');
    expect(formatted).toContain('Basic textarea');

    // WHEN: Positioning
    const positioned = calculatePositions(steps, increments);
    const positionedFirst = positioned.find(inc => inc.id === '1.1.1');

    // THEN: Data preserved
    expect(positionedFirst).toBeDefined();
    expect(positionedFirst!.id).toBe('1.1.1');
    expect(positionedFirst!.title).toContain('Basic textarea');
    expect(positionedFirst!.stepId).toBe('1.1');
  });

  it('should handle large feature breakdowns efficiently', async () => {
    // GIVEN: Large markdown with many steps and increments
    const largeMarkdown = `
## Steps Overview

| # | Step ID | Name | Layer |
|---|---------|------|-------|
${Array.from({ length: 10 }, (_, i) => `| ${i + 1} | ${i + 1}.1 | Step ${i + 1} | UI |`).join('\n')}

${Array.from({ length: 10 }, (_, i) => `
## Step ${i + 1}.1: Step ${i + 1}

| # | Increment | Effort | Value | Risk |
|---|-----------|--------|-------|------|
${Array.from({ length: 5 }, (_, j) => `| ${j + 1} | **${i + 1}.1.${j + 1}** - Increment ${j + 1} | 1/5 | 5/5 | 1/5 |`).join('\n')}
`).join('\n')}
`;

    // WHEN: Processing large markdown
    const validation = validateMarkdown(largeMarkdown);
    expect(validation.isValid).toBe(true);

    const { steps, increments } = parseMarkdown(largeMarkdown);

    // THEN: Handles large data sets
    expect(steps.length).toBe(10);
    expect(increments.length).toBe(50);

    const positioned = calculatePositions(steps, increments);
    expect(positioned.length).toBe(50);

    // All positions should be valid
    positioned.forEach(inc => {
      expect(inc.x).toBeGreaterThanOrEqual(0);
      expect(inc.y).toBeGreaterThanOrEqual(0);
    });
  });

  it('should maintain correct step-to-increment relationships', () => {
    // GIVEN: Parsed data
    const { steps, increments } = parseMarkdown(exampleMarkdown);

    // WHEN: Checking relationships
    steps.forEach(step => {
      const stepIncrements = increments.filter(inc => inc.stepId === step.id);

      // THEN: Each step has its increments
      expect(stepIncrements.length).toBeGreaterThan(0);

      // All increments have correct stepId
      stepIncrements.forEach(inc => {
        expect(inc.stepId).toBe(step.id);
        expect(inc.id).toContain(step.id); // e.g., 1.1.1 contains 1.1
      });
    });
  });

  it('should handle Miro SDK errors gracefully', async () => {
    // GIVEN: Miro SDK will fail
    mockCreateStickyNote.mockRejectedValue(new Error('Network error'));

    const { steps, increments } = parseMarkdown(exampleMarkdown);
    const positioned = calculatePositions(steps, increments);

    // WHEN: Creating stickies fails
    let error;
    try {
      await createStickiesFromIncrements(positioned);
    } catch (e) {
      error = e;
    }

    // THEN: Error is caught and can be handled
    expect(error).toBeDefined();
  });

  describe('Edge cases and boundary conditions', () => {
    it('should handle single step with single increment', () => {
      const minimalMarkdown = `
| # | Step ID | Name |
|---|---------|------|
| 1 | 1.1 | Test |

| # | Increment | Effort |
|---|-----------|--------|
| 1 | **1.1.1** - Test | 1/5 |
`;

      const validation = validateMarkdown(minimalMarkdown);
      expect(validation.isValid).toBe(true);

      const { steps, increments } = parseMarkdown(minimalMarkdown);
      expect(steps).toHaveLength(1);
      expect(increments).toHaveLength(1);

      const positioned = calculatePositions(steps, increments);
      expect(positioned).toHaveLength(1);
      expect(positioned[0].x).toBe(0);
      expect(positioned[0].y).toBe(0);
    });

    it('should handle steps with varying increment counts', () => {
      const variedMarkdown = `
| # | Step ID | Name |
|---|---------|------|
| 1 | 1.1 | Step 1 |
| 2 | 1.2 | Step 2 |

| # | Increment | Effort |
|---|-----------|--------|
| 1 | **1.1.1** - Test 1 | 1/5 |

| # | Increment | Effort |
|---|-----------|--------|
| 1 | **1.2.1** - Test 2a | 1/5 |
| 2 | **1.2.2** - Test 2b | 1/5 |
| 3 | **1.2.3** - Test 2c | 1/5 |
`;

      const { steps, increments } = parseMarkdown(variedMarkdown);
      const positioned = calculatePositions(steps, increments);

      // Step 1 has 1 increment, Step 2 has 3
      const step1Incs = positioned.filter(inc => inc.stepId === '1.1');
      const step2Incs = positioned.filter(inc => inc.stepId === '1.2');

      expect(step1Incs).toHaveLength(1);
      expect(step2Incs).toHaveLength(3);

      // All in different rows
      expect(step1Incs[0].y).not.toBe(step2Incs[0].y);
    });

    it('should handle special characters in content', async () => {
      const specialCharsMarkdown = `
| # | Step ID | Name |
|---|---------|------|
| 1 | 1.1 | Test & Verify <HTML> |

| # | Increment | Effort |
|---|-----------|--------|
| 1 | **1.1.1** - Test "quotes" & 'apostrophes' | 1/5 |
`;

      const { steps, increments } = parseMarkdown(specialCharsMarkdown);
      expect(increments[0].title).toContain('"quotes"');
      expect(increments[0].title).toContain("'apostrophes'");

      const formatted = formatStickyContent(increments[0]);
      expect(formatted).toContain('"quotes"');
      expect(formatted).toContain("'apostrophes'");
    });
  });
});
