// Component tests for BreakdownForm
// Increments 1.1.1, 1.2.1, 1.3.1

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BreakdownForm } from './BreakdownForm';

// Mock Miro SDK
const mockCreateStickyNote = vi.fn();
const mockZoomTo = vi.fn();

beforeEach(() => {
  // Reset mocks before each test
  mockCreateStickyNote.mockClear();
  mockZoomTo.mockClear();

  // Setup Miro mock
  global.miro = {
    board: {
      createStickyNote: mockCreateStickyNote,
      viewport: {
        zoomTo: mockZoomTo,
      },
    },
  } as any;

  // Default successful response
  mockCreateStickyNote.mockResolvedValue({
    id: 'sticky-123',
    content: 'test',
  });
});

describe('BreakdownForm Component - 1.1.1, 1.2.1, 1.3.1', () => {
  describe('Textarea rendering - 1.1.1', () => {
    it('should render textarea in component', () => {
      // GIVEN: component is mounted
      render(<BreakdownForm />);

      // WHEN: looking for textarea
      const textarea = screen.getByRole('textbox');

      // THEN: textarea element is visible
      expect(textarea).toBeInTheDocument();
    });

    it('should display placeholder text', () => {
      // GIVEN: textarea is empty
      render(<BreakdownForm />);

      // WHEN: component renders
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      // THEN: placeholder text shows example markdown format
      expect(textarea.placeholder).toContain('Paste your feature breakdown');
      expect(textarea.placeholder).toContain('Example format');
    });

    it('should accept user input', async () => {
      // GIVEN: textarea has focus
      const user = userEvent.setup();
      render(<BreakdownForm />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      // WHEN: user types markdown
      const testInput = 'Test markdown content';
      await user.type(textarea, testInput);

      // THEN: text appears in textarea and is preserved
      expect(textarea.value).toBe(testInput);
    });

    it('should preserve pasted content', async () => {
      // GIVEN: user pastes markdown
      const user = userEvent.setup();
      render(<BreakdownForm />);
      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

      const pastedContent = `| # | Step | Name |
|---|------|------|
| 1 | 1.1 | Test |`;

      // WHEN: user pastes content
      await user.click(textarea);
      await user.paste(pastedContent);

      // THEN: content is preserved
      expect(textarea.value).toBe(pastedContent);
    });
  });

  describe('Validation - 1.2.1', () => {
    it('should show error for invalid input', async () => {
      // GIVEN: user has pasted text without pipe tables
      const user = userEvent.setup();
      render(<BreakdownForm />);
      const textarea = screen.getByRole('textbox');

      // WHEN: user types invalid markdown
      await user.type(textarea, 'Just some text without tables');

      // THEN: error message "Markdown must contain a table" is displayed
      await waitFor(() => {
        expect(screen.getByText(/must contain a table/i)).toBeInTheDocument();
      });
    });

    it('should not show error for valid table', async () => {
      // GIVEN: user has pasted markdown with pipe tables
      const user = userEvent.setup();
      render(<BreakdownForm />);
      const textarea = screen.getByRole('textbox');

      const validMarkdown = `| # | Step | Name |
|---|------|------|
| 1 | 1.1 | Test |`;

      // WHEN: user pastes valid markdown
      await user.click(textarea);
      await user.paste(validMarkdown);

      // THEN: no error message appears
      await waitFor(() => {
        const errorMessages = screen.queryByText(/must contain a table/i);
        expect(errorMessages).not.toBeInTheDocument();
      });
    });

    it('should show error for empty input on blur', async () => {
      // GIVEN: textarea is empty
      render(<BreakdownForm />);
      const button = screen.getByRole('button', { name: /create breakdown/i });

      // THEN: submit button is disabled
      expect(button).toBeDisabled();
    });

    it('should enable button with valid input', async () => {
      // GIVEN: textarea contains valid markdown table
      const user = userEvent.setup();
      render(<BreakdownForm />);
      const textarea = screen.getByRole('textbox');
      const button = screen.getByRole('button', { name: /create breakdown/i });

      const validMarkdown = `| # | Step ID | Name |
|---|---------|------|
| 1 | 1.1 | Test |

| # | Increment | Effort |
|---|-----------|--------|
| 1 | **1.1.1** - Test | 1/5 |`;

      // WHEN: validation passes
      await user.click(textarea);
      await user.paste(validMarkdown);

      // THEN: submit button is enabled and clickable
      await waitFor(() => {
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe('Submit button - 1.3.1', () => {
    it('should be disabled when no valid input', () => {
      // GIVEN: textarea is empty
      render(<BreakdownForm />);

      // WHEN: user looks at submit button
      const button = screen.getByRole('button', { name: /create breakdown/i });

      // THEN: button appears disabled and cannot be clicked
      expect(button).toBeDisabled();
    });

    it('should show loading state during processing', async () => {
      // GIVEN: user clicks submit button with valid input
      const user = userEvent.setup();
      render(<BreakdownForm />);
      const textarea = screen.getByRole('textbox');

      const validMarkdown = `| # | Step ID | Name | Layer |
|---|---------|------|-------|
| 1 | 1.1 | Test Step | UI |

| # | Increment | Effort | Value | Risk |
|---|-----------|--------|-------|------|
| 1 | **1.1.1** - Test increment | 1/5 | 5/5 | 1/5 |`;

      await user.click(textarea);
      await user.paste(validMarkdown);

      // Mock createStickyNote to delay
      mockCreateStickyNote.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ id: '123' }), 100))
      );

      // WHEN: parsing starts
      const button = screen.getByRole('button', { name: /create breakdown/i });
      await waitFor(() => expect(button).not.toBeDisabled());
      await user.click(button);

      // THEN: button shows "Creating..." text, button is disabled
      await waitFor(() => {
        expect(screen.getByText(/creating/i)).toBeInTheDocument();
        expect(button).toBeDisabled();
      });
    });

    it('should disable button while processing', async () => {
      // GIVEN: valid input and button enabled
      const user = userEvent.setup();
      render(<BreakdownForm />);
      const textarea = screen.getByRole('textbox');

      const validMarkdown = `| # | Step ID | Name | Layer |
|---|---------|------|-------|
| 1 | 1.1 | Test | UI |

| # | Increment | Effort | Value | Risk |
|---|-----------|--------|-------|------|
| 1 | **1.1.1** - Test | 1/5 | 5/5 | 1/5 |`;

      await user.click(textarea);
      await user.paste(validMarkdown);

      const button = screen.getByRole('button', { name: /create breakdown/i });
      await waitFor(() => expect(button).not.toBeDisabled());

      // WHEN: user clicks button
      await user.click(button);

      // THEN: button is disabled during processing
      expect(button).toBeDisabled();
    });
  });

  describe('Error handling', () => {
    it('should show error when Miro SDK fails', async () => {
      // GIVEN: Miro SDK will fail
      mockCreateStickyNote.mockRejectedValue(new Error('SDK Error'));

      const user = userEvent.setup();
      render(<BreakdownForm />);
      const textarea = screen.getByRole('textbox');

      const validMarkdown = `| # | Step ID | Name | Layer |
|---|---------|------|-------|
| 1 | 1.1 | Test | UI |

| # | Increment | Effort | Value | Risk |
|---|-----------|--------|-------|------|
| 1 | **1.1.1** - Test | 1/5 | 5/5 | 1/5 |`;

      await user.click(textarea);
      await user.paste(validMarkdown);

      const button = screen.getByRole('button', { name: /create breakdown/i });
      await waitFor(() => expect(button).not.toBeDisabled());

      // WHEN: user submits
      await user.click(button);

      // THEN: error message is shown
      await waitFor(() => {
        expect(screen.getByText(/failed to create breakdown/i)).toBeInTheDocument();
      });
    });

    it('should show error when no steps found', async () => {
      // GIVEN: markdown with table but no valid steps
      const user = userEvent.setup();
      render(<BreakdownForm />);
      const textarea = screen.getByRole('textbox');

      const invalidMarkdown = `| # | Wrong | Headers |
|---|-------|---------|
| 1 | data | data |`;

      await user.click(textarea);
      await user.paste(invalidMarkdown);

      const button = screen.getByRole('button', { name: /create breakdown/i });
      await waitFor(() => expect(button).not.toBeDisabled());

      // WHEN: user submits
      await user.click(button);

      // THEN: error shown
      await waitFor(() => {
        expect(screen.getByText(/no steps or increments found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Real-time validation feedback', () => {
    it('should show success indicator for valid markdown', async () => {
      // GIVEN: valid markdown
      const user = userEvent.setup();
      render(<BreakdownForm />);
      const textarea = screen.getByRole('textbox');

      const validMarkdown = `| # | Step | Name |
|---|------|------|
| 1 | 1.1 | Test |`;

      // WHEN: user enters valid markdown
      await user.click(textarea);
      await user.paste(validMarkdown);

      // THEN: success indicator shown
      await waitFor(() => {
        expect(screen.getByText(/valid markdown detected/i)).toBeInTheDocument();
      });
    });

    it('should update validation as user types', async () => {
      // GIVEN: user starts with invalid input
      const user = userEvent.setup();
      render(<BreakdownForm />);
      const textarea = screen.getByRole('textbox');

      // WHEN: user types invalid markdown first
      await user.type(textarea, 'Invalid text');

      // THEN: error shown
      await waitFor(() => {
        expect(screen.getByText(/must contain a table/i)).toBeInTheDocument();
      });

      // WHEN: user clears and adds valid table
      await user.clear(textarea);
      await user.paste(`| # | Step | Name |
|---|------|------|
| 1 | 1.1 | Test |`);

      // THEN: error removed, success shown
      await waitFor(() => {
        expect(screen.queryByText(/must contain a table/i)).not.toBeInTheDocument();
        expect(screen.getByText(/valid markdown detected/i)).toBeInTheDocument();
      });
    });
  });
});
