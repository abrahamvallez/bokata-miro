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
 * Parse steps overview table with flexible format detection
 * Increment 2.2.1 - Enhanced version
 * @param tableString The steps table markdown
 * @returns Array of Step objects
 */
export function parseStepsOverview(tableString: string): Step[] {
  const steps: Step[] = [];
  const lines = tableString.split('\n').filter(line => line.trim().length > 0);

  if (lines.length < 3) return steps; // Need at least header, separator, and one data row

  // Parse header to find column indices
  const headerCells = parseTableRow(lines[0]);

  // Find Step ID column (flexible detection)
  let stepIdIndex = -1;
  let nameIndex = -1;

  headerCells.forEach((header, index) => {
    const lowerHeader = header.toLowerCase();
    // Look for step id column
    if (lowerHeader.includes('step') && (lowerHeader.includes('#') || lowerHeader.includes('id'))) {
      stepIdIndex = index;
    }
    // Look for name column
    if (lowerHeader.includes('name') && !lowerHeader.includes('step')) {
      nameIndex = index;
    }
  });

  // Skip header and separator lines
  const dataLines = lines.slice(2);

  for (const line of dataLines) {
    const cells = parseTableRow(line);

    // Try detected indices first
    if (stepIdIndex >= 0 && nameIndex >= 0 && cells.length > Math.max(stepIdIndex, nameIndex)) {
      const stepId = cells[stepIdIndex];
      const stepName = cells[nameIndex];

      // Validate that stepId looks like a step ID (e.g., "1.1", "2.1")
      if (stepId && stepName && /^\d+\.\d+$/.test(stepId.trim())) {
        steps.push({
          id: stepId.trim(),
          name: stepName.trim(),
        });
        continue;
      }
    }

    // Fallback: scan all cells for step ID pattern
    for (let i = 0; i < cells.length - 1; i++) {
      const potentialId = cells[i].trim();
      // Check if this cell looks like a step ID
      if (/^\d+\.\d+$/.test(potentialId)) {
        // Next cell should be the name
        const stepName = cells[i + 1]?.trim();
        if (stepName) {
          steps.push({
            id: potentialId,
            name: stepName,
          });
          break;
        }
      }
    }
  }

  return steps;
}

/**
 * Parse increment table for a specific step with flexible format detection
 * Increment 2.3.1 - Enhanced version
 * @param tableString The increment table markdown
 * @param stepId The parent step ID
 * @returns Array of Increment objects
 */
export function parseIncrements(tableString: string, stepId: string): Increment[] {
  const increments: Increment[] = [];
  const lines = tableString.split('\n').filter(line => line.trim().length > 0);

  if (lines.length < 3) return increments; // Need at least header, separator, and one data row

  // Parse header to understand format
  const headerCells = parseTableRow(lines[0]);
  let incrementColumnIndex = -1;

  headerCells.forEach((header, index) => {
    if (header.toLowerCase().includes('increment')) {
      incrementColumnIndex = index;
    }
  });

  // Skip header and separator lines
  const dataLines = lines.slice(2);

  for (const line of dataLines) {
    const cells = parseTableRow(line);

    if (cells.length >= 2) {
      let incrementId = '';
      let incrementTitle = '';

      // Try format 1: ID and title in separate columns (e.g., "1.1.1 ⭐" | "Title")
      // Check first cell for increment ID pattern
      const firstCell = cells[0].trim();
      const idMatch = firstCell.match(/(\d+\.\d+\.\d+)/);

      if (idMatch && cells.length >= 2) {
        incrementId = idMatch[1];
        incrementTitle = cells[1].trim();
      } else {
        // Try format 2: ID and title in same column (e.g., "**1.1.1** - Title")
        // Look in increment column or second column
        const targetCell = incrementColumnIndex >= 0 ? cells[incrementColumnIndex] : cells[1];
        const combined = targetCell.trim();

        // Try multiple patterns
        const patterns = [
          /\*?\*?(\d+\.\d+\.\d+)\*?\*?\s*-\s*(.+)/, // **1.1.1** - Title
          /(\d+\.\d+\.\d+)\s*[⭐★✨]?\s*-?\s*(.+)/, // 1.1.1 ⭐ - Title
          /(\d+\.\d+\.\d+)\s+(.+)/, // 1.1.1 Title
        ];

        for (const pattern of patterns) {
          const match = combined.match(pattern);
          if (match && match[2]?.trim()) {
            incrementId = match[1];
            incrementTitle = match[2].trim();
            break;
          }
        }
      }

      // Clean up title (remove markdown formatting, emojis from end)
      if (incrementTitle) {
        incrementTitle = incrementTitle
          .replace(/\*\*/g, '') // Remove bold markers
          .replace(/[⭐★✨]+\s*$/, '') // Remove trailing stars/emojis
          .trim();
      }

      // Validate and add increment
      if (incrementId && incrementTitle && /^\d+\.\d+\.\d+$/.test(incrementId)) {
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
 * Enhanced to handle various formats
 * @param tables Array of table strings
 * @returns Object with steps table and increment tables
 */
function categorizeTablesalt(tables: string[]): { stepsTable: string | null; incrementTables: string[] } {
  let stepsTable: string | null = null;
  const incrementTables: string[] = [];

  for (const table of tables) {
    const firstLine = table.split('\n')[0].toLowerCase();

    // Check if this is a steps overview table
    // Look for "step #", "step id", or combination of "step" + "name" + "layer"
    const isStepsTable =
      firstLine.includes('step #') ||
      firstLine.includes('step id') ||
      (firstLine.includes('step') && firstLine.includes('name') && firstLine.includes('layer'));

    // Check if this is an increment table
    // Has "increment" column but not "step #" or "step id"
    const isIncrementTable =
      firstLine.includes('increment') &&
      !firstLine.includes('step #') &&
      !firstLine.includes('step id');

    if (isStepsTable && !stepsTable) {
      // Take first steps table found
      stepsTable = table;
    } else if (isIncrementTable || (!isStepsTable && !stepsTable)) {
      // It's an increment table or can't determine (assume increment)
      incrementTables.push(table);
    } else if (!isStepsTable && !isIncrementTable) {
      // Can't categorize, assume increment table
      incrementTables.push(table);
    }
  }

  return { stepsTable, incrementTables };
}

/**
 * Extract feature title from markdown (first heading of any level)
 * @param markdown The markdown string
 * @returns Feature title or default if not found
 */
export function extractFeatureTitle(markdown: string): string {
  const lines = markdown.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    // Match any heading level: # Title, ## Title, ### Title, etc.
    const headingMatch = trimmedLine.match(/^#{1,6}\s+(.+)$/);
    if (headingMatch && headingMatch[1]) {
      return headingMatch[1].trim();
    }
  }

  return 'Untitled Feature'; // Default title if not found
}

/**
 * Parse entire markdown document
 * Combines all parsing functions
 * @param markdown The markdown string
 * @returns ParsedMarkdown object with feature title, steps and increments
 */
export function parseMarkdown(markdown: string): ParsedMarkdown {
  // Extract feature title
  const featureTitle = extractFeatureTitle(markdown);

  // Extract all tables
  const tables = extractTableStructure(markdown);

  if (tables.length === 0) {
    return { featureTitle, steps: [], increments: [] };
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
    featureTitle,
    steps,
    increments: allIncrements,
  };
}
