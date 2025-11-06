// Validation service for markdown input
// Increment 1.2.1 - Basic check for markdown table presence

import { ValidationResult } from '../types';

/**
 * Validates if the markdown contains pipe-delimited tables
 * @param markdown The markdown string to validate
 * @returns ValidationResult with isValid flag and error message if applicable
 */
export function validateMarkdown(markdown: string): ValidationResult {
  // Check if input is empty
  if (!markdown || markdown.trim().length === 0) {
    return {
      isValid: false,
      error: 'Please paste markdown content',
    };
  }

  // Check if markdown contains pipe-delimited tables
  // A table should have pipes (|) and should have at least header and separator lines
  const hasPipes = markdown.includes('|');
  const hasTableStructure = /\|.*\|[\r\n]+\|[-:\s|]+\|/.test(markdown);

  if (!hasPipes || !hasTableStructure) {
    return {
      isValid: false,
      error: 'Markdown must contain a table with pipe delimiters (|)',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}
