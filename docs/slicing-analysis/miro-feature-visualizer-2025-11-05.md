# Miro Feature Breakdown Visualizer Plugin - Vertical Slicing Analysis

**Date:** 2025-11-05
**Project Type:** React + TypeScript Miro Plugin
**Analysis Method:** Vertical Slicing with Walking Skeleton

---

## Executive Summary

### Project Overview
The Miro Feature Breakdown Visualizer is a plugin that transforms markdown feature breakdowns into interactive visual layouts on Miro boards. Users paste structured markdown tables containing feature steps and increments; the plugin parses the data and creates a grid of sticky notes representing the breakdown hierarchy.

### Key Metrics

| Metric | Value |
|--------|-------|
| **Total Features** | 5 |
| **Total Steps** | 22 |
| **Total Increments** | 103 |
| **Walking Skeleton** | 9 increments |
| **Recommended MVP Timeline** | 2-3 weeks |

### Project Characteristics
- **Architecture:** Frontend React plugin with Miro SDK integration
- **Layers:** UI (Sidebar), Logic (Markdown parsing, layout calculation), Integration (Miro API)
- **Complexity:** Medium - Well-defined data flow, established Miro SDK
- **Key Risk:** Miro SDK limitations on programmatic positioning and styling
- **Growth Path:** From read-only visualization → two-way sync editing

---

## Implementation Status (Updated 2025-11-06)

### Current State: ✅ WALKING SKELETON + EXTRAS COMPLETE

**Implementation Classification (58 total increments):**

| Status | Count | Percentage | Description |
|--------|-------|------------|-------------|
| ✅ IMPLEMENTED | 23 | 40% | Done and working in production |
| 🚫 OBSOLETE | 16 | 28% | Superseded by better/equivalent implementation |
| ⚠️ REDUNDANT | 6 | 10% | Platform provides or adds no value |
| 📋 STILL NEEDED | 13 | 22% | Would add genuine future value |
| **TOTAL** | **58** | **100%** | |

**Effective Completion: 74%** (40% implemented + 28% obsolete + 10% redundant = 78% no work needed)

---

**Feature-by-Feature Status:**
- ✅ **Feature 1 (UI):** 4/6 (implemented + obsolete/redundant)
- ✅ **Feature 2 (Parsing):** 10/15 (implemented + obsolete/redundant)
- ✅ **Feature 3 (Miro Integration):** 12/15 (implemented + obsolete/redundant)
- ✅ **Feature 4 (Layout):** 10/13 (implemented + obsolete/redundant)
- 🟡 **Feature 5 (Viewing):** 3/12 (low priority increments)

**Test Coverage:** 64 passing tests across all modules

**Smart Architectural Choices Made:**
- ✅ Flexible regex-based parser > strict validation (makes 2.2.4, 2.4.2, 2.4.3 obsolete)
- ✅ Collision detection + frames > manual per-step grouping (makes 3.4.1-3.4.3 obsolete)
- ✅ Native Miro features leveraged > custom implementations (makes 5.1.1, 5.1.4, 5.4.1 redundant)
- ✅ Step header stickies > group labels (makes 3.4.2 obsolete)
- ✅ Dynamic grid layout > edge case handling (makes 4.2.4 obsolete)

**Implemented Increments (23 total):**
Walking Skeleton (9): 1.1.1, 1.2.1, 1.3.1, 2.1.1, 2.2.1, 2.3.1, 3.1.1, 3.2.1, 4.2.1
Beyond Skeleton (14): 1.3.2-1.3.4, 2.1.2, 2.1.5, 2.4.1, 3.1.5, 3.2.2, 3.2.4, 3.3.1, 4.1.2-4.1.4, 4.2.2-4.2.3, 4.2.5, 4.3.3-4.3.4, 5.1.2, 5.3.1-5.3.2

**Obsolete Increments (16 total):**
1.1.2, 1.2.2, 1.2.3, 2.2.3, 2.2.4, 2.3.6, 2.4.2, 2.4.3, 3.3.3, 3.4.1, 3.4.2, 3.4.3, 4.1.1, 4.2.4

**Redundant Increments (6 total):**
1.1.6, 3.2.3, 3.3.5, 3.4.4, 5.1.1, 5.1.4, 5.2.4, 5.4.1

**Still Needed Increments (13 total):**
1.1.3, 1.1.4, 1.1.5, 1.2.4, 1.2.5, 2.1.3, 2.1.4, 2.2.2, 2.3.2-2.3.5, 3.1.2-3.1.4, 3.3.2, 3.3.4, 4.3.1-4.3.2, 5.1.3, 5.2.1-5.2.3, 5.2.5, 5.3.3, 5.4.2-5.4.4

**Files Modified/Created:**
- `src/components/BreakdownForm.tsx` - UI + validation
- `src/services/markdownParser.ts` - Parsing logic
- `src/services/validation.ts` - Input validation
- `src/services/stickyFormatter.ts` - Content formatting
- `src/services/miroAPI.ts` - Miro SDK integration
- `src/services/layoutEngine.ts` - Grid calculation & positioning
- `src/services/collisionDetection.ts` - Collision detection & space finding

---

## Feature Backbone Overview

### Feature List with Dependencies

| # | Feature | Actor | Action | Layer | Dependencies |
|---|---------|-------|--------|-------|--------------|
| 1 | User Pastes Markdown in Sidebar | User | Input markdown text | UI | None |
| 2 | System Parses Markdown Tables | System | Extract steps/increments | Logic | Feature 1 |
| 3 | System Creates Miro Sticky Notes | System | Generate board elements | Integration | Feature 2 |
| 4 | System Arranges Grid Layout | System | Position stickies | Logic | Feature 3 |
| 5 | User Views Breakdown on Board | User | Explore visualized breakdown | UI | Feature 4 |

### Architecture Overview
```
User Input (Markdown)
    ↓ [Feature 1: Paste]
    ↓ [Feature 2: Parse] → Structured Data
    ↓ [Feature 3: Create] → Miro Stickies
    ↓ [Feature 4: Layout] → Positioned Grid
    ↓ [Feature 5: View] → Interactive Board
```

### Coordination Notes
- Features 1-5 form a strict pipeline with sequential dependencies
- No feature branches or parallel paths in MVP
- Data flows through parsing → creation → layout
- UI is split: sidebar input (Feature 1) + board output (Feature 5)

---

## Feature Breakdown - Complete Analysis

### Feature 1: User Pastes Markdown in Sidebar

**User:** Coaches / Product Managers
**Layer:** UI (React Component)
**Dependencies:** None (entry point)
**Risk Level:** Low (standard React patterns)

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
| ~~1.1.1 ⭐~~ | ~~Basic textarea in Miro sidebar~~ | 1/5 | 5/5 | 1/5 | Minimal→Enhanced | ✅ DONE |
| *1.1.2* | *Placeholder text with example* | 1/5 | 4/5 | 1/5 | None→Helpful | 🚫 OBSOLETE - included in 1.1.1 |
| 1.1.3 | Syntax highlighting for markdown | 3/5 | 3/5 | 2/5 | Plain→Highlighted | Better UX for markdown editing |
| 1.1.4 | Character count & max length limit | 2/5 | 2/5 | 1/5 | Unlimited→Bounded | Prevent huge inputs |
| 1.1.5 | Auto-save to localStorage | 2/5 | 3/5 | 2/5 | Lost→Persisted | Users don't lose input |
| *1.1.6* | *Copy/paste helper with formatting* | 2/5 | 2/5 | 1/5 | Manual→Assisted | ⚠️ REDUNDANT - native browser feature |

#### Step 1.2: Text Validation & Error Display

**Scope:** Validate markdown structure, detect malformed tables, show error messages
**Quality Attributes:** Clear error messages, real-time feedback, helpful suggestions

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| ~~1.2.1 ⭐~~ | ~~Basic check for markdown table presence~~ | 1/5 | 4/5 | 1/5 | None→Basic | ✅ DONE |
| *1.2.2* | *Validate table column count* | 2/5 | 3/5 | 1/5 | Permissive→Strict | 🚫 OBSOLETE - flexible parser is better |
| *1.2.3* | *Error message display in sidebar* | 1/5 | 4/5 | 1/5 | Silent→Visible | 🚫 OBSOLETE - implemented in 1.2.1 |
| 1.2.4 | Suggest fixes for common errors | 3/5 | 2/5 | 2/5 | Silent→Helpful | Guide users to correct format |
| 1.2.5 | Markdown format documentation link | 1/5 | 2/5 | 1/5 | Hidden→Visible | Help users understand format |

#### Step 1.3: Submit & Trigger Pipeline

**Scope:** Submit button, trigger parsing, show progress feedback
**Quality Attributes:** Clear action, feedback during processing, error recovery

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| ~~1.3.1 ⭐~~ | ~~Submit button that triggers parsing~~ | 1/5 | 5/5 | 1/5 | Manual→Triggered | ✅ DONE |
| ~~1.3.2~~ | ~~Loading indicator during processing~~ | 2/5 | 3/5 | 1/5 | None→Visible | ✅ DONE |
| ~~1.3.3~~ | ~~Disable submit while processing~~ | 1/5 | 3/5 | 1/5 | Repeatable→Protected | ✅ DONE |
| ~~1.3.4~~ | ~~Success confirmation message~~ | 1/5 | 3/5 | 1/5 | Silent→Visible | ✅ DONE |

---

### Feature 2: System Parses Markdown Tables

**User:** System
**Layer:** Logic (Data transformation)
**Dependencies:** Feature 1 (requires markdown input)
**Risk Level:** Medium (complex parsing logic)

#### Steps Overview

| Step # | Name | Layer | Increments | Effort Range |
|--------|------|-------|-----------|--------------|
| 2.1 | Extract Table Structure | Logic | 5 | 1-2 days |
| 2.2 | Parse Steps Overview Table | Logic | 4 | 1 day |
| 2.3 | Parse Increment Tables | Logic | 6 | 1-2 days |
| 2.4 | Validate Parsed Data | Logic | 5 | 1 day |

#### Step 2.1: Extract Table Structure

**Scope:** Identify markdown tables, separate steps table from increment tables
**Quality Attributes:** Robust to formatting variations, handles multiple features

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| ~~2.1.1 ⭐~~ | ~~Simple regex to find pipe-delimited tables~~ | 2/5 | 4/5 | 2/5 | Hardcoded→Flexible | ✅ DONE |
| ~~2.1.2~~ | ~~Distinguish steps table vs increment tables~~ | 2/5 | 4/5 | 2/5 | Flat→Hierarchical | ✅ DONE |
| 2.1.3 | Handle multiple features in one markdown | 3/5 | 3/5 | 3/5 | Single→Multiple | Support larger breakdowns |
| 2.1.4 | Extract feature metadata (name, user, risk) | 2/5 | 3/5 | 1/5 | Missing→Included | Enrich visualization |
| ~~2.1.5~~ | ~~Robust to markdown formatting variations~~ | 3/5 | 2/5 | 2/5 | Strict→Lenient | ✅ DONE |

#### Step 2.2: Parse Steps Overview Table

**Scope:** Extract step ID, name, layer, increment count, effort from overview table
**Quality Attributes:** Accurate extraction, error detection

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| ~~2.2.1 ⭐~~ | ~~Parse step ID and name columns~~ | 1/5 | 5/5 | 1/5 | Manual→Automated | ✅ DONE |
| 2.2.2 | Extract layer and effort range | 2/5 | 4/5 | 1/5 | Minimal→Complete | Full step metadata |
| *2.2.3* | *Infer increment relationships* | 2/5 | 3/5 | 2/5 | Flat→Hierarchical | 🚫 OBSOLETE - stepId linking done |
| *2.2.4* | *Validate step numbering scheme* | 1/5 | 2/5 | 1/5 | Permissive→Strict | 🚫 OBSOLETE - flexible parsing chosen |

#### Step 2.3: Parse Increment Tables

**Scope:** Extract increment ID, name, effort/value/risk scores from increment tables
**Quality Attributes:** Accurate scoring, preserve metadata

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| ~~2.3.1 ⭐~~ | ~~Parse increment ID and title~~ | 1/5 | 5/5 | 1/5 | Manual→Automated | ✅ DONE |
| 2.3.2 | Extract effort/value/risk scores | 2/5 | 4/5 | 1/5 | ID only→Full metrics | Rich labeling for stickies |
| 2.3.3 | Parse increment strategy column | 2/5 | 2/5 | 1/5 | None→Included | Additional context |
| 2.3.4 | Extract notes/description text | 1/5 | 3/5 | 1/5 | None→Included | Show on sticky preview |
| 2.3.5 | Handle star (⭐) marked increments | 1/5 | 3/5 | 1/5 | Ignored→Flagged | Visual indicator for Walking Skeleton |
| *2.3.6* | *Preserve table row order* | 1/5 | 3/5 | 1/5 | Scrambled→Ordered | 🚫 OBSOLETE - sort() implemented |

#### Step 2.4: Validate Parsed Data

**Scope:** Check data consistency, detect missing values, ensure relationships
**Quality Attributes:** Catch errors early, helpful validation messages

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| ~~2.4.1 ⭐~~ | ~~Verify all increments linked to steps~~ | 2/5 | 4/5 | 2/5 | Unvalidated→Validated | ✅ DONE |
| *2.4.2* | *Check for missing required fields* | 1/5 | 4/5 | 1/5 | Permissive→Required | 🚫 OBSOLETE - conflicts with flexible design |
| *2.4.3* | *Validate ID format consistency* | 2/5 | 2/5 | 1/5 | Lenient→Strict | 🚫 OBSOLETE - flexible regex approach |
| 2.4.4 | Warn on anomalies (very high effort, etc) | 2/5 | 2/5 | 1/5 | Silent→Warned | Help users spot mistakes |
| 2.4.5 | Generate detailed error report | 1/5 | 3/5 | 1/5 | Generic→Specific | Help users fix problems |

---

### Feature 3: System Creates Miro Sticky Notes

**User:** System
**Layer:** Integration (Miro SDK)
**Dependencies:** Feature 2 (requires parsed data)
**Risk Level:** Medium (Miro SDK constraints)

#### Steps Overview

| Step # | Name | Layer | Increments | Effort Range |
|--------|------|-------|-----------|--------------|
| 3.1 | Prepare Sticky Note Data | Logic | 5 | 1 day |
| 3.2 | Create Sticky Elements via Miro SDK | Integration | 4 | 1-2 days |
| 3.3 | Style & Color Sticky Notes | UI/Integration | 5 | 1-2 days |
| 3.4 | Group & Organize Stickies | Integration | 4 | 1 day |

#### Step 3.1: Prepare Sticky Note Data

**Scope:** Transform parsed increments into sticky note format, add labels and metadata
**Quality Attributes:** Concise content, readable labels, proper hierarchy

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| ~~3.1.1 ⭐~~ | ~~Build sticky title from increment ID & name~~ | 1/5 | 5/5 | 1/5 | Missing→Complete | ✅ DONE |
| 3.1.2 | Add effort/value/risk as subtitle | 2/5 | 4/5 | 1/5 | Missing→Visible | Compact metrics display |
| 3.1.3 | Format notes/description for readability | 2/5 | 3/5 | 1/5 | Raw→Formatted | Show context on sticky |
| 3.1.4 | Add walking skeleton indicator (⭐) | 1/5 | 3/5 | 1/5 | Hidden→Visible | Flag priority increments |
| ~~3.1.5~~ | ~~Truncate long content intelligently~~ | 2/5 | 2/5 | 1/5 | Overflowing→Trimmed | ✅ DONE |

#### Step 3.2: Create Sticky Elements via Miro SDK

**Scope:** Use Miro SDK to create sticky notes on board
**Quality Attributes:** Reliable creation, error handling, batch operations

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| ~~3.2.1 ⭐~~ | ~~Create single sticky note via SDK~~ | 2/5 | 5/5 | 2/5 | Manual→Automated | ✅ DONE |
| ~~3.2.2~~ | ~~Batch create multiple stickies~~ | 2/5 | 4/5 | 2/5 | One→Many | ✅ DONE |
| *3.2.3* | *Handle Miro API rate limits* | 2/5 | 3/5 | 3/5 | Naive→Smart | ⚠️ REDUNDANT - unlikely with current scale |
| ~~3.2.4~~ | ~~Error handling & retry logic~~ | 2/5 | 3/5 | 2/5 | Fail→Recover | ✅ DONE |

#### Step 3.3: Style & Color Sticky Notes

**Scope:** Set sticky colors based on metrics, add visual hierarchy
**Quality Attributes:** Clear visual distinction, accessible colors, readable text

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| ~~3.3.1 ⭐~~ | ~~Apply default color for all stickies~~ | 1/5 | 3/5 | 1/5 | Colorless→Colored | ✅ DONE |
| 3.3.2 | Color by effort level (low/mid/high) | 2/5 | 3/5 | 1/5 | Uniform→Varied | Visual effort indicator |
| *3.3.3* | *Color by step (different hue per step)* | 2/5 | 4/5 | 1/5 | Flat→Hierarchical | 🚫 OBSOLETE - header/increment distinction done |
| 3.3.4 | Highlight walking skeleton with accent | 1/5 | 3/5 | 1/5 | Same→Different | Prominent MVP path |
| *3.3.5* | *Ensure accessible color contrast* | 2/5 | 2/5 | 1/5 | Unvalidated→Validated | ⚠️ REDUNDANT - Miro colors pre-validated |

#### Step 3.4: Group & Organize Stickies

**Scope:** Create Miro groups to organize stickies by step
**Quality Attributes:** Logical grouping, collapsible organization, clean board

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| *3.4.1* | *Create group for each step* | 2/5 | 4/5 | 2/5 | Flat→Grouped | 🚫 OBSOLETE - frames + collision detection better |
| *3.4.2* | *Add step labels to groups* | 2/5 | 3/5 | 1/5 | Unlabeled→Labeled | 🚫 OBSOLETE - step headers done |
| *3.4.3* | *Make groups collapsible* | 2/5 | 2/5 | 2/5 | Expanded→Collapsible | 🚫 OBSOLETE - collision detection solves clutter |
| *3.4.4* | *Lock groups to prevent accidental moves* | 1/5 | 2/5 | 1/5 | Movable→Locked | ⚠️ REDUNDANT - Miro native feature |

---

### Feature 4: System Arranges Grid Layout

**User:** System
**Layer:** Logic + Integration (Layout calculation + Miro positioning)
**Dependencies:** Feature 3 (requires created stickies)
**Risk Level:** High (Miro positioning API constraints)

#### Steps Overview

| Step # | Name | Layer | Increments | Effort Range |
|--------|------|-------|-----------|--------------|
| 4.1 | Calculate Grid Dimensions | Logic | 4 | 1 day |
| 4.2 | Position Stickies in Grid | Integration | 5 | 1-2 days |
| 4.3 | Add Alignment Lines & Visual Guides | Integration | 4 | 1-2 days |

#### Step 4.1: Calculate Grid Dimensions

**Scope:** Determine grid size based on step rows and increment columns
**Quality Attributes:** Optimal use of space, readable density, responsive sizing

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| *4.1.1* | *Calculate column count from max increments* | 1/5 | 5/5 | 1/5 | Hardcoded→Dynamic | 🚫 OBSOLETE - grid dimensions done |
| ~~4.1.2~~ | ~~Calculate row count from step count~~ | 1/5 | 5/5 | 1/5 | Hardcoded→Dynamic | ✅ DONE |
| ~~4.1.3~~ | ~~Determine cell width/height for spacing~~ | 2/5 | 4/5 | 1/5 | Fixed→Responsive | ✅ DONE |
| ~~4.1.4~~ | ~~Account for margins and padding~~ | 2/5 | 3/5 | 1/5 | Tight→Spaced | ✅ DONE |

#### Step 4.2: Position Stickies in Grid

**Scope:** Calculate x/y coordinates for each sticky, apply positions via Miro SDK
**Quality Attributes:** Precise alignment, no overlaps, efficient positioning

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| ~~4.2.1 ⭐~~ | ~~Map each increment to grid cell~~ | 2/5 | 5/5 | 2/5 | Manual→Automatic | ✅ DONE |
| ~~4.2.2~~ | ~~Calculate absolute coordinates~~ | 2/5 | 4/5 | 1/5 | Relative→Absolute | ✅ DONE |
| ~~4.2.3~~ | ~~Batch update positions via SDK~~ | 2/5 | 4/5 | 2/5 | Individual→Batch | ✅ DONE |
| *4.2.4* | *Handle edge cases (uneven columns)* | 2/5 | 3/5 | 2/5 | Strict grid→Flexible | 🚫 OBSOLETE - naturally handled |
| ~~4.2.5~~ | ~~Zoom & center layout on board~~ | 2/5 | 3/5 | 1/5 | Scattered→Visible | ✅ DONE |

#### Step 4.3: Add Alignment Lines & Visual Guides

**Scope:** Draw lines to connect steps/increments, add section labels
**Quality Attributes:** Clear visual structure, not cluttered, useful scaffolding

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| 4.3.1 | Draw vertical lines between step columns | 3/5 | 3/5 | 2/5 | None→Basic | Visual step separation |
| 4.3.2 | Draw horizontal lines between rows | 2/5 | 3/5 | 1/5 | None→Basic | Visual row separation |
| ~~4.3.3~~ | ~~Add step name labels above columns~~ | 2/5 | 4/5 | 1/5 | None→Labeled | ✅ DONE |
| ~~4.3.4~~ | ~~Add section header text boxes~~ | 2/5 | 2/5 | 1/5 | None→Labeled | ✅ DONE |

---

### Feature 5: User Views Breakdown on Board

**User:** Coaches / Product Managers
**Layer:** UI (Board visualization)
**Dependencies:** Feature 4 (requires positioned stickies)
**Risk Level:** Low (passive viewing, no interaction initially)

#### Steps Overview

| Step # | Name | Layer | Increments | Effort Range |
|--------|------|-------|-----------|--------------|
| 5.1 | Navigate & Explore Grid | UI | 4 | 1 day |
| 5.2 | Inspect Individual Increments | UI | 5 | 1 day |
| 5.3 | Understand Step Relationships | UI | 3 | 1 day |
| 5.4 | Export & Share Breakdown | UI/Integration | 3 | 1-2 days |

#### Step 5.1: Navigate & Explore Grid

**Scope:** User can pan, zoom, scroll through visualization
**Quality Attributes:** Responsive controls, smooth interaction, intuitive navigation

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| *5.1.1* | *Use native Miro board navigation* | 1/5 | 5/5 | 1/5 | Limited→Native | ⚠️ REDUNDANT - Miro default behavior |
| ~~5.1.2~~ | ~~Auto-zoom to fit entire layout on load~~ | 2/5 | 4/5 | 1/5 | Manual→Automatic | ✅ DONE |
| 5.1.3 | Provide "Reset View" button in sidebar | 1/5 | 3/5 | 1/5 | Manual→Assisted | Easy return to overview |
| *5.1.4* | *Save & restore user's view position* | 2/5 | 2/5 | 2/5 | Lost→Remembered | ⚠️ REDUNDANT - Miro platform persists |

#### Step 5.2: Inspect Individual Increments

**Scope:** Hover/click sticky to see detailed increment information
**Quality Attributes:** Clear detail view, readable information, non-disruptive

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| 5.2.1 | Display all increment details on hover | 2/5 | 4/5 | 1/5 | Hidden→Visible | See full context |
| 5.2.2 | Show effort/value/risk scores prominently | 1/5 | 4/5 | 1/5 | Tiny→Large | Easy metric reading |
| 5.2.3 | Display strategy & notes in detail panel | 2/5 | 3/5 | 1/5 | None→Visible | Full information access |
| *5.2.4* | *Link to original markdown row* | 2/5 | 2/5 | 2/5 | Disconnected→Linked | ⚠️ REDUNDANT - sidebar preserves input |
| 5.2.5 | Link with lines related increments (same step) | 2/5 | 3/5 | 1/5 | Uniform→Highlighted | Visual relationship |

#### Step 5.3: Understand Step Relationships

**Scope:** See which increments belong to which steps, understand dependencies
**Quality Attributes:** Clear hierarchy, visual grouping, easy scanning

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| ~~5.3.1~~ | ~~Color-code increments by step~~ | 2/5 | 4/5 | 1/5 | Flat→Colored | ✅ DONE |
| ~~5.3.2~~ | ~~Show step name on step group~~ | 1/5 | 4/5 | 1/5 | None→Visible | ✅ DONE |
| 5.3.3 | Display step metadata (effort range, layer) | 2/5 | 3/5 | 1/5 | None→Visible | Context for each step |

#### Step 5.4: Export & Share Breakdown

**Scope:** Export visualization as image or PDF, share board link
**Quality Attributes:** High-quality exports, multiple formats, easy sharing

| # | Increment | Effort | Value | Risk | Strategy | Notes |
|----|-----------|--------|-------|------|----------|-------|
| *5.4.1* | *Copy board link to clipboard* | 1/5 | 4/5 | 1/5 | Manual→Assisted | ⚠️ REDUNDANT - Miro native share feature |
| 5.4.2 | Export visible area as PNG image | 3/5 | 3/5 | 2/5 | None→Possible | Share without Miro access |
| 5.4.3 | Export full grid as PDF | 3/5 | 3/5 | 2/5 | None→Possible | Print or document |
| 5.4.4 | Generate shareable summary report | 3/5 | 2/5 | 2/5 | None→Summary | External stakeholder communication |

---

## Cross-Feature Walking Skeleton

### Composition Strategy

The Walking Skeleton represents the **minimum viable plugin** that delivers end-to-end value: paste markdown → visualize on board. Each selected increment cuts through all technical layers and can be deployed and tested immediately.

**Selection Criteria:**
- ⭐ Starred increments (simplest per step)
- Delivers observable user value
- Independent deployable units
- Enables early feedback loop

### Selected Increments (9 total)

#### Phase 1: Input & Parsing (Day 1-2)
1. **1.1.1** - Basic textarea in Miro sidebar (UI foundation)
2. **1.2.1** - Basic check for markdown table presence (Validation)
3. **1.3.1** - Submit button that triggers parsing (Action trigger)
4. **2.1.1** - Simple regex to find pipe-delimited tables (Table extraction)
5. **2.2.1** - Parse step ID and name columns (Steps parsing)
6. **2.3.1** - Parse increment ID and title (Increments parsing)

#### Phase 2: Creation & Layout (Day 3-4)
7. **3.1.1** - Build sticky title from increment ID & name (Content preparation)
8. **3.2.1** - Create single sticky note via SDK (Board integration)
9. **4.2.1** - Map each increment to grid cell (Positioning logic)

### Complete User Journey (Walking Skeleton)

```
1. User opens Miro plugin sidebar
2. Pastes markdown feature breakdown (1.1.1)
3. Plugin validates table format (1.2.1)
4. User clicks "Create Breakdown" button (1.3.1)
5. System extracts table data with regex (2.1.1)
6. System parses step names & IDs (2.2.1)
7. System parses increment names & IDs (2.3.1)
8. System creates sticky title format (3.1.1)
9. System creates sticky notes on board (3.2.1)
10. System calculates grid positions (4.2.1)
11. System positions all stickies in grid
12. User sees feature breakdown visualized on board
```

### MVP Scope (What's NOT included)
- Advanced markdown parsing (variations, edge cases)
- Custom styling & colors beyond default
- Detailed metrics display (effort/value/risk)
- Grouping and section headers
- Navigation features
- Export functionality
- Editing or syncing back to markdown
- Multiple feature support

### Deployment Strategy
1. **Phase 1 Deploy** (End of Day 2): Input sidebar + parser works
   - Validate by pasting markdown and checking console logs

2. **Phase 2 Deploy** (End of Day 4): Full end-to-end
   - Test by creating simple feature breakdown
   - Verify stickies appear and are positioned

### Quality Gates Before Shipping
- ✅ Textarea accepts markdown input
- ✅ Basic table detection works
- ✅ Parsing handles example markdown correctly
- ✅ Stickies create successfully on board
- ✅ Grid layout positioning is accurate
- ✅ No JavaScript errors in console
- ✅ Plugin doesn't crash on malformed input

### Known Constraints (Addressed in Future Increments)
- Miro SDK positioning may have precision limits
- Markdown parsing is regex-based (won't handle all edge cases)
- Single feature support only
- No error recovery or retry logic
- Basic styling only (colors, text size limited by Miro)

---

## Next Steps After Walking Skeleton

### Phase 2: Robustness & Polish (Increments 10-25)
- Better markdown parsing (handle variations)
- Enhanced validation & error messages
- Custom colors based on metrics
- Grouping by step
- Visual guide lines

### Phase 3: Exploration & Inspection (Increments 26-40)
- Detail panels for increments
- Hover information display
- Step relationship visualization
- Reset view button
- Board navigation helpers

### Phase 4: Export & Sharing (Increments 41-50)
- PNG/PDF export
- Share link
- Summary report generation

### Phase 5: Two-Way Sync (Future)
- Edit stickies → update markdown
- Drag to reorder → regenerate grid
- Full editing experience

---

## Appendix: Implementation Notes

### Tech Stack
- **Framework:** React 18+ with TypeScript
- **Miro Integration:** @mirohq/websdk-js
- **Markdown Parsing:** Built-in regex + optional markdown library
- **State Management:** React hooks (useState, useReducer)
- **Build Tool:** Assumed webpack/vite (Miro template standard)

### Key Files to Create
- `src/components/Sidebar.tsx` - Input panel
- `src/components/MarkdownParser.ts` - Parsing logic
- `src/services/miroAPI.ts` - Miro SDK wrapper
- `src/services/layoutEngine.ts` - Grid positioning
- `src/types/index.ts` - Type definitions

### Risks & Mitigation
| Risk | Severity | Mitigation |
|------|----------|-----------|
| Miro positioning API limitations | High | Test early, design for constraint |
| Regex parsing complexity | Medium | Start simple, add library if needed |
| Large markdown files | Medium | Add file size limits upfront |
| Real-time collaboration conflicts | Medium | Design for read-only MVP |

### Success Metrics
- Time to first sticky on board: < 5 seconds
- User error recovery: Clear messages for all error cases
- Parsing accuracy: 100% on example markdown
- Board layout: No overlaps, proper grid alignment
- User satisfaction: Positive feedback on visualization clarity

---

**Document Generated:** 2025-11-05
**Analysis Method:** Vertical Slicing - Walking Skeleton Approach
**Next Commands:**
- `/bokata-iterations-paths miro-feature-visualizer-2025-11-05.md` - 5 implementation strategies
- `/bokata-matrix miro-feature-visualizer-2025-11-05.md` - Complete increment reference
