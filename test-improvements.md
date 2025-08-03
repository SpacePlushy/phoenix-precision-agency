# Test Improvements Plan

## Priority 1: Fix the Disabled Auto-Switch Test

### Current Issue
The auto-switch test in DemoContainer is commented out because Framer Motion animations don't work well with fake timers.

### Solution
Create a proper mock for Framer Motion and test the underlying state changes:

```typescript
// Add to test setup
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, animate, initial, exit, ...props }: any) => {
      // Simulate animation states
      const state = animate?.opacity === 1 ? 'visible' : 'hidden';
      return <div data-animation-state={state} {...props}>{children}</div>;
    }
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Updated test
it('auto-switches between views after 3 seconds', async () => {
  render(<DemoContainer />);
  
  // Verify initial state
  const oldViewButton = screen.getByRole('button', { name: /2005 Website/i });
  const newViewButton = screen.getByRole('button', { name: /Modern Website/i });
  
  expect(oldViewButton).toHaveClass('shadow-lg', 'scale-105');
  expect(newViewButton).not.toHaveClass('shadow-lg', 'scale-105');
  
  // Advance time to trigger auto-switch
  act(() => {
    jest.advanceTimersByTime(3000);
  });
  
  // Wait for state update
  await waitFor(() => {
    expect(newViewButton).toHaveClass('shadow-lg', 'scale-105');
    expect(oldViewButton).not.toHaveClass('shadow-lg', 'scale-105');
  });
  
  // Verify it switches back
  act(() => {
    jest.advanceTimersByTime(3000);
  });
  
  await waitFor(() => {
    expect(oldViewButton).toHaveClass('shadow-lg', 'scale-105');
    expect(newViewButton).not.toHaveClass('shadow-lg', 'scale-105');
  });
});
```

## Priority 2: Add Missing Edge Case Tests

### Analytics Module
```typescript
describe('Analytics Module - Edge Cases', () => {
  it('handles division by zero gracefully', async () => {
    mockUpstash.getAnalyticsRange.mockResolvedValue([{
      date: '2025-08-01',
      totalViews: 0,
      oldVersionViews: 0,
      newVersionViews: 0,
      avgDuration: 0,
      avgInteractions: 0,
      totalInteractions: 0,
      uniqueSessions: 0,
    }]);

    const result = await compareVersionPerformance(1);
    
    expect(result.oldVersion.avgDuration).toBe(0);
    expect(result.oldVersion.avgInteractions).toBe(0);
    expect(result.oldVersion.engagementScore).toBe(0);
    expect(result.winner).toBe('tie');
    expect(result.confidence).toBe(0);
  });

  it('handles extreme interaction values', async () => {
    mockUpstash.getAnalyticsRange.mockResolvedValue([{
      date: '2025-08-01',
      totalViews: 100,
      oldVersionViews: 50,
      newVersionViews: 50,
      avgDuration: 300000, // 5 minutes
      avgInteractions: 100, // Very high
      totalInteractions: 10000,
      uniqueSessions: 100,
    }]);

    const result = await compareVersionPerformance(1);
    
    // Engagement score should cap at 100
    expect(result.oldVersion.engagementScore).toBeLessThanOrEqual(100);
    expect(result.newVersion.engagementScore).toBeLessThanOrEqual(100);
  });
});
```

## Priority 3: Integration Tests for Critical Flows

### Demo Analytics Flow
```typescript
// New test file: integration/demo-analytics-flow.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DemoContainer from '@/components/demo/DemoContainer';
import * as analytics from '@/lib/analytics';

jest.mock('@/lib/analytics');

describe('Demo Analytics Integration', () => {
  it('tracks complete user interaction flow', async () => {
    const user = userEvent.setup();
    const mockTrackStart = jest.spyOn(analytics, 'trackDemoStart');
    const mockTrackInteraction = jest.spyOn(analytics, 'trackDemoInteraction');
    const mockTrackEnd = jest.spyOn(analytics, 'trackDemoEnd');
    
    render(<DemoContainer />);
    
    // Should track start when component mounts
    expect(mockTrackStart).toHaveBeenCalledWith(
      expect.stringMatching(/^session_/),
      'old'
    );
    
    const sessionId = mockTrackStart.mock.calls[0][0];
    
    // User clicks new view
    const newViewButton = screen.getByRole('button', { name: /Modern Website/i });
    await user.click(newViewButton);
    
    expect(mockTrackInteraction).toHaveBeenCalledWith(sessionId);
    
    // User interacts with demo content
    const demoContent = screen.getByTestId('new-site-view');
    await user.click(demoContent);
    
    expect(mockTrackInteraction).toHaveBeenCalledTimes(2);
    
    // Component unmounts (user navigates away)
    // Note: In real implementation, you'd test this with router navigation
  });
});
```

## Priority 4: Performance Tests

### Add Performance Monitoring
```typescript
describe('Performance Metrics', () => {
  it('renders without performance degradation', async () => {
    const startTime = performance.now();
    
    render(<DemoContainer />);
    
    const renderTime = performance.now() - startTime;
    
    // Initial render should be fast
    expect(renderTime).toBeLessThan(100); // 100ms threshold
    
    // Measure re-renders during view switching
    const measurements: number[] = [];
    const user = userEvent.setup();
    
    for (let i = 0; i < 5; i++) {
      const beforeClick = performance.now();
      
      await user.click(
        screen.getByRole('button', { 
          name: i % 2 === 0 ? /Modern Website/i : /2005 Website/i 
        })
      );
      
      measurements.push(performance.now() - beforeClick);
    }
    
    // Average interaction should be fast
    const avgTime = measurements.reduce((a, b) => a + b) / measurements.length;
    expect(avgTime).toBeLessThan(50); // 50ms threshold
  });
});
```

## Priority 5: Accessibility Tests

### Comprehensive A11y Testing
```typescript
describe('Accessibility', () => {
  it('supports keyboard navigation through demo controls', async () => {
    render(<DemoContainer />);
    
    const oldButton = screen.getByRole('button', { name: /2005 Website/i });
    const newButton = screen.getByRole('button', { name: /Modern Website/i });
    
    // Tab to first button
    await userEvent.tab();
    expect(oldButton).toHaveFocus();
    
    // Tab to second button
    await userEvent.tab();
    expect(newButton).toHaveFocus();
    
    // Activate with Enter
    await userEvent.keyboard('{Enter}');
    expect(newButton).toHaveClass('shadow-lg', 'scale-105');
    
    // Activate with Space
    await userEvent.tab();
    await userEvent.tab(); // Tab back to old button
    await userEvent.keyboard(' ');
    expect(oldButton).toHaveClass('shadow-lg', 'scale-105');
  });
  
  it('announces view changes to screen readers', async () => {
    render(<DemoContainer />);
    
    // Check for ARIA live regions
    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    
    // Switch views and check announcement
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Modern Website/i }));
    
    expect(liveRegion).toHaveTextContent('Now showing modern website view');
  });
});
```

## Implementation Priority

1. **Immediate**: Fix the auto-switch test (Priority 1)
2. **This Sprint**: Add edge case tests (Priority 2)
3. **Next Sprint**: Add integration tests (Priority 3)
4. **Future**: Performance and accessibility tests (Priorities 4-5)

## Test Coverage Goals

- Unit tests: 85%+ coverage
- Integration tests: Cover all critical user paths
- E2E tests: Cover happy path + key edge cases
- Performance tests: Establish baselines and monitor regressions