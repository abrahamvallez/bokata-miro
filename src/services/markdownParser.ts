// Markdown parsing service
// Increments 2.1.1, 2.2.1, 2.3.1 - Extract tables and parse steps/increments

import { ParsedMarkdown, Step, Increment } from '../types';

/**
 * Extract all pipe-delimited tables from markdown
 * Increment 2.1.1
 * @param markdown The markdown string
 * @returns Array of table strings
 */
export function extractTableStructure(markdown: string): string[] {
  const tables: string[] = [];

  // Split by double newlines to find potential table blocks
  const blocks = markdown.split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.trim().split('\n');

    // Check if this block looks like a table (has pipes and separator line)
    if (lines.length >= 2) {
      const hasPipes = lines.every(line => line.includes('|'));
      const hasSeparator = lines.some(line => /^\|[-:\s|]+\|$/.test(line.trim()));

      if (hasPipes && hasSeparator) {
        tables.push(block.trim());
      }
    }
  }

  return tables;
}

/**
 * Parse a table row into cells
 * @param row The table row string
 * @returns Array of cell values
 */
function parseTableRow(row: string): string[] {
  return row
    .split('|')
    .map(cell => cell.trim())
    .filter(cell => cell.length > 0);
}

/**
 * Parse steps overview table
 * Increment 2.2.1
 * @param tableString The steps table markdown
 * @returns Array of Step objects
 */
export function parseStepsOverview(tableString: string): Step[] {
  const steps: Step[] = [];
  const lines = tableString.split('\n').filter(line => line.trim().length > 0);

  if (lines.length < 3) return steps; // Need at least header, separator, and one data row

  // Skip header and separator lines
  const dataLines = lines.slice(2);

  for (const line of dataLines) {
    const cells = parseTableRow(line);

    if (cells.length >= 3) {
      // Assuming format: | # | Step ID | Name | ... |
      const stepId = cells[1]; // Second column is Step ID
      const stepName = cells[2]; // Third column is Name

      if (stepId && stepName) {
        steps.push({
          id: stepId,
          name: stepName,
        });
      }
    }
  }

  return steps;
}

/**
 * Parse increment table for a specific step
 * Increment 2.3.1
 * @param tableString The increment table markdown
 * @param stepId The parent step ID
 * @returns Array of Increment objects
 */
export function parseIncrements(tableString: string, stepId: string): Increment[] {
  const increments: Increment[] = [];
  const lines = tableString.split('\n').filter(line => line.trim().length > 0);

  if (lines.length < 3) return increments; // Need at least header, separator, and one data row

  // Skip header and separator lines
  const dataLines = lines.slice(2);

  for (const line of dataLines) {
    const cells = parseTableRow(line);

    if (cells.length >= 2) {
      // Assuming format: | # | Increment | Effort | Value | Risk |
      const incrementText = cells[1]; // Second column is Increment (ID + title)

      // Extract increment ID (e.g., "1.1.1") and title
      // Format is usually like "**1.1.1** - Title here"
      const match = incrementText.match(/\*?\*?(\d+\.\d+\.\d+)\*?\*?\s*-?\s*(.+)/);

      if (match) {
        const incrementId = match[1];
        const incrementTitle = match[2].trim();

        increments.push({
          id: incrementId,
          title: incrementTitle,
          stepId: stepId,
        });
      }
    }
  }

  return increments;
}

/**
 * Identify which tables are steps tables vs increment tables
 * @param tables Array of table strings
 * @returns Object with steps table and increment tables
 */
function categorizeTablesalt(tables: string[]): { stepsTable: string | null; incrementTables: string[] } {
  let stepsTable: string | null = null;
  const incrementTables: string[] = [];

  for (const table of tables) {
    const firstLine = table.split('\n')[0].toLowerCase();

    // Steps table usually has "step id" or "step" column
    if (firstLine.includes('step') && !firstLine.includes('increment')) {
      stepsTable = table;
    } else {
      // Assume it's an increment table
      incrementTables.push(table);
    }
  }

  return { stepsTable, incrementTables };
}

/**
 * Parse entire markdown document
 * Combines all parsing functions
 * @param markdown The markdown string
 * @returns ParsedMarkdown object with steps and increments
 */
export function parseMarkdown(markdown: string): ParsedMarkdown {
  // Extract all tables
  const tables = extractTableStructure(markdown);

  if (tables.length === 0) {
    return { steps: [], increments: [] };
  }

  // Categorize tables
  const { stepsTable, incrementTables } = categorizeTablesalt(tables);

  // Parse steps
  const steps = stepsTable ? parseStepsOverview(stepsTable) : [];

  // Parse increments from each increment table
  let allIncrements: Increment[] = [];

  for (const incrementTable of incrementTables) {
    // Try to determine which step this table belongs to
    // by looking at the increment IDs in the table
    const lines = incrementTable.split('\n');
    let stepId = '';

    for (const line of lines) {
      const match = line.match(/(\d+\.\d+)\.\d+/);
      if (match) {
        stepId = match[1];
        break;
      }
    }

    if (stepId) {
      const increments = parseIncrements(incrementTable, stepId);
      allIncrements = allIncrements.concat(increments);
    }
  }

  return {
    steps,
    increments: allIncrements,
  };
}
