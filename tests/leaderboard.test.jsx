import React, { render, screen, fireEvent, waitFor, useRef } from '@testing-library/react';
import Leaderboard from '../src/Leaderboard';
import { describe, vi } from 'vitest';
import { calcVisibleRows } from '../src/utils/calcVisibleRows';

beforeEach(() => {
  const mockCSV = `
  Rank,Username,Email,WARs Submitted,Total Score
  1,user1,user1@example.com,5,100
  2,user2,user2@example.com,4,95
  3,user3,user3@example.com,3,90
  4,user4,user4@example.com,2,85
  5,user5,user5@example.com,4,80
  6,user6,user6@example.com,1,75
  7,user7,user7@example.com,2,70
  8,user8,user8@example.com,3,65
  9,user9,user9@example.com,2,60
  10,user10,user10@example.com,3,55
  11,user11,user11@example.com,2,50
  12,user12,user12@example.com,1,45
  `.trim();

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    text: () => Promise.resolve(mockCSV),
  });

  vi.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('mock-token');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Leaderboard component', () => {  
  test('renders leaderboard with correct headers', () => {
    render(<Leaderboard />);
    expect(screen.getByText('Rank')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Total Score')).toBeInTheDocument();
  });
});

describe('Dropdown menu loads', async () => {  
  test('renders dropdown menu with options', () => {
    render(<Leaderboard />);
    expect(screen.getByText('Detachment')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Detachment'));
    expect(screen.getByText('Delta')).toBeInTheDocument();
  });
});

describe('Returning N/A for missing data', () => {  
  test('renders N/A for missing username', async () => {
    const mockCSV = `
    Rank,Username,Email,WARs Submitted,Total Score
,,,,
    `.trim();
    global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockCSV),
    });
    render(<Leaderboard />);
    await waitFor(() => {
      const naelements = screen.getAllByText('N/A');
      expect(naelements.length).toBe(3);
      const zeroelements = screen.getAllByText('0');
      expect(zeroelements.length).toBe(2);
    });
  });
});

describe('Scrolling adds rows to table', () => {  
  test('loads more rows on scroll', async () => {
    render(<Leaderboard />);
    const container = screen.getByTestId('leaderboard-table');
    await waitFor(() => {
      expect(container.querySelectorAll('.leaderboard-row').length).toBe(10);
    });
    fireEvent.scroll(container, {
      target: { scrollTop: container.scrollHeight },
    });
    await waitFor(() => {
      const rows = container.querySelectorAll('.leaderboard-row');
      expect(rows.length).toBeGreaterThan(10);
    })
  })
});

describe('Returned row count', () => {  
  test('returns newCount when under totalRows', () => {
    expect(calcVisibleRows(10, 5, 20)).toBe(15);
  });

  test('returns totalRows when newCount exceeds totalRows', () => {
    expect(calcVisibleRows(15, 10, 20)).toBe(20);
  });

  test('returns totalRows when newCount equals totalRows', () => {
    expect(calcVisibleRows(10, 10, 20)).toBe(20);
  });
});

