// Breakdown Form Component
// Increments 1.1.1, 1.2.1, 1.3.1 - Textarea, validation, and submit button

import * as React from 'react';
import { validateMarkdown } from '../services/validation';
import { parseMarkdown } from '../services/markdownParser';
import { calculateAllBoardItems } from '../services/layoutEngine';
import { createAllBoardItems, zoomToStickies } from '../services/miroAPI';

const PLACEHOLDER_TEXT = 'Paste your feature breakdown markdown here...\n\nExample format:\n\n| # | Step ID | Name | Layer |\n|---|---------|------|-------|\n| 1 | 1.1 | Sidebar Text Input | UI |\n\n## Step 1.1: Sidebar Text Input\n\n| # | Increment | Effort | Value | Risk |\n|---|-----------|--------|-------|------|\n| 1 | **1.1.1** - Basic textarea in Miro sidebar | 1/5 | 5/5 | 1/5 |';

export const BreakdownForm: React.FC = () => {
  const [markdown, setMarkdown] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Validate on input change
  React.useEffect(() => {
    if (markdown.length > 0) {
      const result = validateMarkdown(markdown);
      setError(result.error);
    } else {
      setError(null);
    }
  }, [markdown]);

  const handleSubmit = async () => {
    // Validate first
    const validationResult = validateMarkdown(markdown);

    if (!validationResult.isValid) {
      setError(validationResult.error);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Parse markdown
      const parsed = parseMarkdown(markdown);
      console.log('Parsed data:', parsed);

      if (parsed.steps.length === 0 || parsed.increments.length === 0) {
        setError('No steps or increments found in markdown');
        setIsLoading(false);
        return;
      }

      // Calculate positions for all board items (step headers + increments)
      const boardItems = calculateAllBoardItems(parsed.steps, parsed.increments);
      console.log('Board items:', boardItems);

      // Create all stickies (headers + increments)
      const stickies = await createAllBoardItems(boardItems);
      console.log('Created stickies:', stickies);

      // Zoom to show all stickies
      await zoomToStickies(stickies);

      // Keep markdown in textarea (don't clear)
      setIsLoading(false);

      // Show success message
      const stepHeaders = boardItems.filter(item => item.type === 'step-header').length;
      const increments = boardItems.filter(item => item.type === 'increment').length;
      alert(`Successfully created ${stickies.length} sticky notes!\n${stepHeaders} step headers + ${increments} increments`);
    } catch (err) {
      console.error('Error creating breakdown:', err);
      setError('Failed to create breakdown. Please try again.');
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = isLoading || !!error || markdown.trim().length === 0;

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
        <h2>Feature Breakdown Visualizer</h2>
        <p>Paste your markdown feature breakdown to visualize it on the board.</p>
      </div>

      <div className="cs1 ce12">
        <label htmlFor="markdown-input">
          <strong>Markdown Input:</strong>
        </label>
        <textarea
          id="markdown-input"
          className="textarea"
          placeholder={PLACEHOLDER_TEXT}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          rows={15}
          style={{
            width: '100%',
            fontFamily: 'monospace',
            fontSize: '12px',
            marginTop: '8px',
          }}
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="cs1 ce12">
          <div className="status-message status-message-error" style={{ padding: '12px' }}>
            {error}
          </div>
        </div>
      )}

      <div className="cs1 ce12">
        <button
          className="button button-primary"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          style={{ width: '100%' }}
        >
          {isLoading ? (
            <>
              <span className="icon-loading" /> Creating...
            </>
          ) : (
            'Create Breakdown'
          )}
        </button>
      </div>

      <div className="cs1 ce12">
        <small style={{ color: '#666' }}>
          {markdown.trim().length > 0 && !error && !isLoading && (
            <span style={{ color: 'green' }}>✓ Valid markdown detected</span>
          )}
        </small>
      </div>
    </div>
  );
};
