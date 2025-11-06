# Miro Feature Breakdown Visualizer - Walking Skeleton Development Plan

**Project:** Miro Feature Breakdown Visualizer Plugin
**Date:** 2025-11-06
**Duration:** 4 Days (2-3 weeks with testing/review)
**Status:** Ready to Start

---

## Overview

El Walking Skeleton es el **mínimo viable** que entrega valor end-to-end: **Paste markdown → Visualize on board**.

Cada incremento:
- ✅ Corta a través de todas las capas técnicas (UI → Logic → Integration)
- ✅ Se puede desplegar y probar inmediatamente
- ✅ Es independiente y funcional

---

## Quick Reference: Acceptance Criteria Summary

| Increment | Function | Key Scenario | Given | When | Then |
|-----------|----------|--------------|-------|------|------|
| **1.1.1** | Textarea | User inputs markdown | Plugin loaded | Text enters textarea | Text appears & preserved |
| **1.2.1** | Validation | Invalid input → error | No pipe tables | Validation runs | Error message shown |
| **1.3.1** | Submit Button | Trigger parsing | Valid input | User clicks button | Parsing starts, loader shows |
| **2.1.1** | Extract Tables | Find all tables | Markdown with 4 tables | Regex extracts | All 4 tables found in order |
| **2.2.1** | Parse Steps | Extract step data | Steps overview table | Parser runs | Steps array with id/name |
| **2.3.1** | Parse Increments | Extract increments | Increment tables | Parser runs | Increments array linked to steps |
| **3.1.1** | Format Sticky | Create sticky content | Increment object | Formatter runs | "1.1.1 - Title" formatted |
| **3.2.1** | Create Sticky | Create on board | SDK initialized | createStickyNote() | Sticky appears with valid ID |
| **4.2.1** | Grid Layout | Position all stickies | Increments + grid dims | Mapping runs | No overlaps, all positioned |

---

## Phase 1: Input & Parsing (Day 1-2)

Objetivo: Usuario pega markdown → Sistema valida → Sistema extrae datos estructurados

### Day 1: UI & Validation

- [ ] **1.1.1** - Basic textarea in Miro sidebar
  - Crear componente React con textarea
  - Integrar en Miro sidebar
  - Placeholder con ejemplo de formato
  - **Effort:** 1/5 | **Value:** 5/5 | **Risk:** 1/5
  - **Acceptance Criteria (Given-When-Then):**
    - **Scenario 1: Textarea renders in sidebar**
      - GIVEN plugin is loaded in Miro
      - WHEN sidebar component mounts
      - THEN textarea element is visible and focused
    - **Scenario 2: Placeholder text is displayed**
      - GIVEN textarea is empty
      - WHEN user opens sidebar for first time
      - THEN placeholder text shows example markdown format
    - **Scenario 3: User can input text**
      - GIVEN textarea has focus
      - WHEN user pastes or types markdown
      - THEN text appears in textarea and is preserved

- [ ] **1.2.1** - Basic check for markdown table presence
  - Detectar si input contiene tabla markdown (pipes |)
  - Mostrar error si no hay tabla
  - Mensaje claro en la UI
  - **Effort:** 1/5 | **Value:** 4/5 | **Risk:** 1/5
  - **Acceptance Criteria (Given-When-Then):**
    - **Scenario 1: Valid table passes validation**
      - GIVEN user has pasted markdown with pipe tables (|)
      - WHEN validation runs
      - THEN no error message appears and submit button is enabled
    - **Scenario 2: Missing table shows error**
      - GIVEN textarea contains text without pipe tables
      - WHEN validation runs
      - THEN error message "Markdown must contain a table" is displayed
    - **Scenario 3: Empty input shows error**
      - GIVEN textarea is empty
      - WHEN validation runs
      - THEN error message is shown and submit button is disabled

- [ ] **1.3.1** - Submit button that triggers parsing
  - Botón "Create Breakdown" en sidebar
  - Habilitar solo si hay input válido
  - Mostrar loading state durante procesamiento
  - **Effort:** 1/5 | **Value:** 5/5 | **Risk:** 1/5
  - **Acceptance Criteria (Given-When-Then):**
    - **Scenario 1: Button is disabled when no valid input**
      - GIVEN textarea is empty or contains invalid markdown
      - WHEN user looks at submit button
      - THEN button appears disabled and cannot be clicked
    - **Scenario 2: Button is enabled with valid input**
      - GIVEN textarea contains valid markdown table
      - WHEN validation passes
      - THEN submit button is enabled and clickable
    - **Scenario 3: Loading state shows during processing**
      - GIVEN user clicks submit button with valid input
      - WHEN parsing starts
      - THEN button shows "Creating..." text and spinner icon, button is disabled

### Day 2: Markdown Parsing

- [ ] **2.1.1** - Simple regex to find pipe-delimited tables
  - Extraer todas las tablas markdown (delimitadas por |)
  - Separar steps table de increment tables
  - Log de tablas encontradas
  - **Effort:** 2/5 | **Value:** 4/5 | **Risk:** 2/5
  - **Acceptance Criteria (Given-When-Then):**
    - **Scenario 1: Single table is extracted**
      - GIVEN markdown contains one pipe-delimited table
      - WHEN parser runs extractTableStructure()
      - THEN returns array with one table object containing all rows
    - **Scenario 2: Multiple tables are extracted**
      - GIVEN markdown contains steps table + 3 increment tables
      - WHEN parser runs extractTableStructure()
      - THEN returns array with 4 table objects in correct order
    - **Scenario 3: Invalid markdown doesn't crash**
      - GIVEN markdown contains text with random pipes but no valid tables
      - WHEN parser runs extractTableStructure()
      - THEN returns empty array (no crash, no error thrown)

- [ ] **2.2.1** - Parse step ID and name columns
  - Leer steps overview table
  - Extraer columnas: step ID, name
  - Estructura: `{ id: "1.1", name: "Sidebar Text Input" }`
  - **Effort:** 1/5 | **Value:** 5/5 | **Risk:** 1/5
  - **Acceptance Criteria (Given-When-Then):**
    - **Scenario 1: Steps are parsed from overview table**
      - GIVEN markdown contains steps overview table with columns: #, Step ID, Name, Layer
      - WHEN parseStepsOverview() runs
      - THEN returns array of steps with { id, name } properties
    - **Scenario 2: Step IDs match markdown format**
      - GIVEN steps table contains "1.1", "1.2", "2.1" in step ID column
      - WHEN parseStepsOverview() parses step IDs
      - THEN steps array contains matching IDs: ["1.1", "1.2", "2.1"]
    - **Scenario 3: Step names are extracted correctly**
      - GIVEN steps table contains step names
      - WHEN parseStepsOverview() parses names
      - THEN each step object has correct name property (not empty)

- [ ] **2.3.1** - Parse increment ID and title
  - Leer increment tables (una por step)
  - Extraer: increment ID, title
  - Link cada increment a su step
  - Estructura: `{ id: "1.1.1", title: "Basic textarea...", stepId: "1.1" }`
  - **Effort:** 1/5 | **Value:** 5/5 | **Risk:** 1/5
  - **Acceptance Criteria (Given-When-Then):**
    - **Scenario 1: Increments are parsed from increment tables**
      - GIVEN markdown contains increment table with columns: #, Increment, Effort, Value, Risk
      - WHEN parseIncrements() runs
      - THEN returns array of increments with { id, title, stepId } properties
    - **Scenario 2: Increments are linked to steps**
      - GIVEN increment table belongs to step "1.1"
      - WHEN parseIncrements() processes this table
      - THEN all increments have stepId = "1.1"
    - **Scenario 3: All increments from all steps are collected**
      - GIVEN markdown has 3 increment tables for steps 1.1, 1.2, 2.1
      - WHEN parseIncrements() runs on all tables
      - THEN total increments returned = sum of all table rows

---

## Phase 2: Creation & Layout (Day 3-4)

Objetivo: Sistema crea sticky notes → Posiciona en grid → Usuario ve visualización

### Day 3: Sticky Creation

- [ ] **3.1.1** - Build sticky title from increment ID & name
  - Formatear contenido para sticky note
  - Formato: `"1.1.1 - Basic textarea in Miro sidebar"`
  - Truncar si es muy largo
  - **Effort:** 1/5 | **Value:** 5/5 | **Risk:** 1/5
  - **Acceptance Criteria (Given-When-Then):**
    - **Scenario 1: Sticky title is formatted correctly**
      - GIVEN increment object: { id: "1.1.1", title: "Basic textarea in Miro sidebar" }
      - WHEN formatStickyContent() processes it
      - THEN returns "1.1.1 - Basic textarea in Miro sidebar"
    - **Scenario 2: Long titles are truncated**
      - GIVEN increment with very long title (> 100 chars)
      - WHEN formatStickyContent() processes it
      - THEN returns truncated string with "..." at end, length <= 100 chars
    - **Scenario 3: All increments produce valid sticky content**
      - GIVEN array of 10 increments
      - WHEN formatStickyContent() processes all
      - THEN all return non-empty strings, no nulls or undefined

- [ ] **3.2.1** - Create single sticky note via SDK
  - Usar Miro SDK para crear primer sticky
  - Validar que aparece en el board
  - Handle basic errors
  - **Effort:** 2/5 | **Value:** 5/5 | **Risk:** 2/5
  - **Acceptance Criteria (Given-When-Then):**
    - **Scenario 1: Single sticky is created on board**
      - GIVEN miro board is open and SDK is initialized
      - WHEN createStickyNote({ content: "1.1.1 - Test" }) is called
      - THEN sticky appears on board with correct content visible
    - **Scenario 2: Created sticky has valid Miro object ID**
      - GIVEN sticky is created successfully
      - WHEN function returns sticky object
      - THEN sticky object has valid id property (string, non-empty)
    - **Scenario 3: Multiple stickies can be created**
      - GIVEN array of 5 increment objects
      - WHEN createStickyNote() is called for each
      - THEN all 5 stickies appear on board, each with unique ID

### Day 4: Grid Layout & Positioning

- [ ] **4.2.1** - Map each increment to grid cell
  - Calcular dimensiones del grid
  - Columns = max increments per step
  - Rows = número de steps
  - Mapear cada increment a [row, col]
  - **Effort:** 2/5 | **Value:** 5/5 | **Risk:** 2/5
  - **Acceptance Criteria (Given-When-Then):**
    - **Scenario 1: Grid dimensions are calculated correctly**
      - GIVEN 3 steps with max 5 increments per step
      - WHEN calculateGridDimensions() runs
      - THEN returns { rows: 3, columns: 5 }
    - **Scenario 2: Each increment is mapped to correct grid cell**
      - GIVEN increments array and calculated grid dimensions
      - WHEN mapIncrementsToGrid() runs
      - THEN each increment has { row, column } properties with valid indices
    - **Scenario 3: No stickies overlap in positions**
      - GIVEN all increments mapped to grid cells
      - WHEN checking for duplicate [row, col] positions
      - THEN no two increments have same position (all unique)
    - **Scenario 4: All stickies are positioned and visible**
      - GIVEN all stickies created and mapped to grid
      - WHEN stickies are moved to calculated positions via Miro SDK
      - THEN all stickies visible on board in grid layout, no gaps or empty cells

---

## Complete User Journey (Walking Skeleton)

```
1. ✅ User abre el sidebar del plugin en Miro
2. ✅ Pega markdown feature breakdown (1.1.1)
3. ✅ Plugin valida formato de tabla (1.2.1)
4. ✅ User hace click en "Create Breakdown" (1.3.1)
5. ✅ Sistema extrae tablas con regex (2.1.1)
6. ✅ Sistema parsea steps y sus IDs (2.2.1)
7. ✅ Sistema parsea increments (2.3.1)
8. ✅ Sistema formatea contenido de stickies (3.1.1)
9. ✅ Sistema crea stickies en el board (3.2.1)
10. ✅ Sistema calcula grid positions (4.2.1)
11. ✅ Sistema posiciona todos los stickies
12. ✅ Usuario ve feature breakdown visualizado en el board
```

---

## Quality Gates Before Shipping

Validación obligatoria antes de cada despliegue:

### Phase 1 Deployment (Fin de Day 2)

- [ ] Textarea acepta input markdown
- [ ] Validación básica de tabla funciona
- [ ] Error messages son claros
- [ ] Submit button se habilita/deshabilita correctamente
- [ ] Parser extrae tablas correctamente (verificar console.log)
- [ ] Steps array se llena correctamente
- [ ] Increments array se llena correctamente
- [ ] Sin errores JavaScript en console
- [ ] Plugin no falla con markdown malformado

### Phase 2 Deployment (Fin de Day 4)

- [ ] Todos los quality gates de Phase 1 pasan ✅
- [ ] Miro SDK está configurado y funciona
- [ ] Primer sticky se crea exitosamente en el board
- [ ] Todos los stickies se crean en el board
- [ ] Grid layout se calcula correctamente
- [ ] Stickies se posicionan sin overlaps
- [ ] Zoom/pan muestra el layout completo
- [ ] User journey funciona end-to-end
- [ ] Sin errores JavaScript en console
- [ ] Plugin no falla bajo carga

---

## Deployment Milestones

### Milestone 1: Phase 1 Complete (End of Day 2)
**Outcome:** Input sidebar + basic parser works

- Deployment approach: Manual testing in local Miro app
- Validation: Paste example markdown, check console logs
- Success criteria: All Phase 1 quality gates pass
- Rollback plan: Revert to previous commit

### Milestone 2: Phase 2 Complete (End of Day 4)
**Outcome:** Full end-to-end: paste → parse → create → position → visualize

- Deployment approach: Manual testing + demo
- Validation: Create simple feature breakdown, verify layout
- Success criteria: User journey completes successfully, all quality gates pass
- Demo focus: Show complete flow, board visualization

---

## Implementation Approach

### Tech Stack
- **Framework:** React 18+ with TypeScript
- **Miro Integration:** @mirohq/websdk-js
- **Markdown Parsing:** Built-in regex (no external library for MVP)
- **State Management:** React hooks (useState, useReducer)
- **Styling:** Miro sidebar styles + inline CSS

### Files to Create/Modify
```
src/
  ├── components/
  │   ├── Sidebar.tsx          ← Feature 1 (textarea)
  │   └── BreakdownForm.tsx    ← Feature 1 (validation + submit)
  ├── services/
  │   ├── markdownParser.ts    ← Features 2 (parsing logic)
  │   ├── miroAPI.ts           ← Features 3 (SDK wrapper)
  │   └── layoutEngine.ts      ← Feature 4 (grid calculation)
  ├── types/
  │   └── index.ts             ← Type definitions
  └── App.tsx                  ← Main app component
```

### Development Order
1. Set up project structure
2. Create Sidebar component with textarea (1.1.1)
3. Add validation logic (1.2.1)
4. Add submit button (1.3.1)
5. Create markdown parser utilities (2.1.1, 2.2.1, 2.3.1)
6. Set up Miro SDK integration (3.2.1)
7. Create sticky content formatter (3.1.1)
8. Implement layout engine (4.2.1)
9. Connect everything end-to-end
10. Test and validate

---

## What's NOT in MVP Scope

Estos increments son para **Phase 3+** (después del Walking Skeleton):

❌ Advanced markdown parsing (edge cases, variations)
❌ Custom colors based on metrics (effort/value/risk)
❌ Grouped stickies by step
❌ Visual guide lines and connectors
❌ Hover/detail panels for increments
❌ Step metadata display
❌ Export functionality (PNG/PDF)
❌ View position save/restore
❌ Multiple feature support
❌ Error recovery with retry logic
❌ Editing or sync back to markdown

---

## Testing Strategy

### Unit Tests (Given-When-Then Based)

#### Feature 1 Tests
- [ ] Textarea component renders and accepts input
- [ ] Validation detects missing tables correctly
- [ ] Submit button enables/disables based on validation state

#### Feature 2 Tests
- [ ] Regex extracts single and multiple tables
- [ ] Parser handles invalid markdown gracefully
- [ ] Steps and increments arrays populate with correct structure
- [ ] All increments link to parent steps correctly

#### Feature 3 Tests
- [ ] Sticky content formats correctly with truncation
- [ ] SDK creates sticky with valid ID
- [ ] Multiple stickies can be created sequentially

#### Feature 4 Tests
- [ ] Grid dimensions calculate correctly
- [ ] Increments map to grid cells without overlaps
- [ ] All stickies position correctly on board

### Integration Tests
- [ ] **Full Pipeline:** User pastes markdown → sees complete breakdown
  - GIVEN: User with valid markdown
  - WHEN: Paste → Validate → Submit → Parse → Create → Position
  - THEN: All 9 increments complete successfully, board shows grid layout

- [ ] **Error Handling:** Invalid input → clear error message
  - GIVEN: User with invalid markdown
  - WHEN: Validation runs
  - THEN: Error message displays, submit button disabled

### Manual Testing Checklist
- [ ] Use provided example markdown from analysis document
- [ ] Try edge cases:
  - [ ] Very long increment titles (should truncate)
  - [ ] Special characters in names
  - [ ] Multiple features in one markdown
- [ ] Verify layout:
  - [ ] No overlapping stickies
  - [ ] Grid alignment is clean
  - [ ] Zoom/pan shows entire layout
- [ ] Validate error messages:
  - [ ] Empty input → clear error
  - [ ] No tables → clear error
  - [ ] Large files → graceful handling
- [ ] Performance:
  - [ ] Time to first sticky < 5 seconds
  - [ ] No lag with 20+ stickies

---

## Known Constraints & Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Miro SDK positioning precision limits | High | Test early, design for constraint |
| Regex parsing complexity | Medium | Start simple, iterate if needed |
| Large markdown files | Medium | Add file size limits early |
| Miro API rate limits | Medium | Implement batching for sticky creation |

---

## Success Criteria

By end of Phase 2 (Day 4):

- ✅ Time to first sticky: < 5 seconds
- ✅ Parsing accuracy: 100% on example markdown
- ✅ Grid alignment: No overlaps, proper spacing
- ✅ User can see complete breakdown visualized
- ✅ Zero JavaScript errors in console
- ✅ Plugin handles error cases gracefully

---

## Quick Reference: Commands & Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Deploy to Miro (when ready)
npm run deploy
```

---

## Example: Testing with Given-When-Then Format

Here's how to write tests and manual checks using the criteria:

### Example 1: Unit Test for Markdown Validation (1.2.1)

```typescript
// Test file: services/validation.test.ts
describe('Markdown Validation - 1.2.1', () => {
  it('should pass validation with pipe tables', () => {
    // GIVEN: markdown with pipe tables
    const markdown = '| # | Step | Name |\n|---|------|------|\n| 1 | 1.1 | Test |';

    // WHEN: validation runs
    const result = validateMarkdown(markdown);

    // THEN: no error, validation passes
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should fail validation without pipe tables', () => {
    // GIVEN: markdown without tables
    const markdown = 'Just some text without tables';

    // WHEN: validation runs
    const result = validateMarkdown(markdown);

    // THEN: error shown, validation fails
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('must contain a table');
  });
});
```

### Example 2: Manual Test Checklist (1.3.1)

```
[ ] Increment 1.3.1: Submit Button
  [ ] GIVEN: Valid markdown in textarea
      - [ ] Copy example markdown from analysis doc
      - [ ] Paste into textarea
      - [ ] Verify validation passes (no error)

  [ ] WHEN: User clicks "Create Breakdown" button
      - [ ] Click submit button
      - [ ] Button should become disabled

  [ ] THEN: Loading indicator appears
      - [ ] Spinner icon visible
      - [ ] Button text changes to "Creating..."
      - [ ] Button stays disabled during processing
      - [ ] Once complete, button re-enables
```

### Example 3: Integration Test (Full Pipeline)

```typescript
// Test file: integration/fullPipeline.test.ts
describe('Full Walking Skeleton Pipeline', () => {
  it('should complete paste → parse → create → position flow', async () => {
    // Setup: Load example markdown
    const exampleMarkdown = loadExampleMarkdown();

    // Phase 1: Paste & Validate
    const validation = validateMarkdown(exampleMarkdown);
    expect(validation.isValid).toBe(true);

    // Phase 2: Parse
    const { steps, increments } = parseMarkdown(exampleMarkdown);
    expect(steps.length).toBeGreaterThan(0);
    expect(increments.length).toBeGreaterThan(0);

    // Phase 3: Format & Create
    const stickyData = increments.map(formatStickyContent);
    const stickies = await createStickiesOnBoard(stickyData);
    expect(stickies.length).toBe(increments.length);

    // Phase 4: Position in Grid
    const gridDims = calculateGridDimensions(steps, increments);
    const positions = mapIncrementsToGrid(increments, gridDims);
    await positionStickies(stickies, positions);

    // Verify: All stickies visible on board
    const boardItems = await getVisibleBoardItems();
    expect(boardItems.length).toBe(increments.length);
  });
});
```

---

## Daily Standup Template

Use this for daily progress tracking:

```
Date: [DATE]
Phase: [PHASE 1 or 2]

Completed Today:
- [x] Increment 1.1.1 - Textarea component (✅ all criteria passing)
- [x] Increment 1.2.1 - Validation logic (✅ all scenarios tested)

Planned for Tomorrow:
- [ ] Increment 1.3.1 - Submit button
- [ ] Increment 2.1.1 - Regex table extraction

Blockers:
- None / [Describe issue and mitigation plan]

Notes:
- [Test results, observations, lessons learned]
- [Any acceptance criteria adjustments needed]
```

---

## Acceptance Criteria Validation Checklist

Before marking an increment as complete:

- [ ] All "GIVEN-WHEN-THEN" scenarios documented and tested
- [ ] Unit tests passing (if applicable)
- [ ] Manual testing completed (if applicable)
- [ ] No console errors or warnings
- [ ] Code follows project standards
- [ ] Functionality ready for next increment's dependency
- [ ] Changes committed with clear message

---

**Document Created:** 2025-11-06
**Last Updated:** 2025-11-06
**Based On:** Miro Feature Breakdown Visualizer - Vertical Slicing Analysis
**Status:** Ready for Development

**Key Resources:**
- Analysis Document: `/docs/slicing-analysis/miro-feature-visualizer-2025-11-05.md`
- Walking Skeleton Plan: This document
- Quick Reference: See "Acceptance Criteria Summary" table above

**Next Steps:**
1. Review this plan with team
2. Confirm tech stack and development environment
3. Start Phase 1, Day 1 with increment 1.1.1
4. Use Given-When-Then format for all validation
5. Update daily standup with completed increments

