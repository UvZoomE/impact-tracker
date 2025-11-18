import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Leaderboard from '../src/Leaderboard';
import { describe, vi } from 'vitest';

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
   `;

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    text: () => Promise.resolve(mockCSV),
  });

  vi.unmock('papaparse');

  vi.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('mock-token');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Error Handling', () => {
  test('handles CSV parse error', async () => {
    vi.resetModules();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mock('papaparse', async (importOriginal) => {
      const original = await importOriginal();
      return {
        ...original,
        default: {
          ...original.default,
          parse: vi.fn((text, config) => {
            config.error?.(new Error("Fake CSV parse error"));
          }),
        },
      };
    });
    const { default: Leaderboard } = await import('../src/Leaderboard');
    render(<Leaderboard />);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("CSV parse error:",
          expect.any(Error)
      );
    });
    consoleSpy.mockRestore();
  })
});

describe('CSV Fetch Error', () => {  
  test('handles CSV fetch error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = vi.fn().mockResolvedValue({new: Error("Fake fetch error")});
    render(<Leaderboard />);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("CSV fetch error:",
      expect.any(Error)
      );
    });
    consoleSpy.mockRestore();
  })
});