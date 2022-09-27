/* eslint-disable global-require */
import { act, render, renderHook, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import mockRouter from 'next-router-mock';

import { Navbar } from '@/components/layout/Navbar';
// For unit tests, the next-router-mock module can be used as a drop-in replacement for next/router:
jest.mock('next/router', () => require('next-router-mock'));
// If you want to mock next/link, you should also include this mock:
jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('Navbar', () => {
  beforeEach(() => {
    render(<Navbar />);
    mockRouter.setCurrentUrl('/');
  });

  it('should render', () => {
    const heading = screen.getByRole('navigation');
    expect(heading).toBeInTheDocument();
  });

  it('mocks useRouter', () => {
    const { result } = renderHook(() => {
      return useRouter();
    });
    expect(result.current).toMatchObject({ asPath: '/' });
    act(() => {
      result.current.push('/about');
    });
    expect(result.current).toMatchObject({ asPath: '/about' });
  });

  it('should render the about link', () => {
    const aboutLinks = screen.getAllByText(/about/i, { selector: 'a' });
    expect(aboutLinks).toHaveLength(2);
    aboutLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/about');
    });
  });
});
