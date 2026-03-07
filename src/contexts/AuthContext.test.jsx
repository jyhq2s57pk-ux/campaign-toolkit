import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted so variables are available when vi.mock factory runs (hoisted)
const { mockSupabase, mockUnsubscribe, getAuthStateCallback, setAuthStateCallback } = vi.hoisted(() => {
  let _authStateCallback = null;
  const mockUnsubscribe = vi.fn();
  const mockSupabase = {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn((cb) => {
        _authStateCallback = cb;
        return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
      }),
    },
  };
  return {
    mockSupabase,
    mockUnsubscribe,
    getAuthStateCallback: () => _authStateCallback,
    setAuthStateCallback: (v) => { _authStateCallback = v; },
  };
});

vi.mock('../lib/supabase', () => ({
  supabase: mockSupabase,
}));

import { AuthProvider, useAuth } from './AuthContext';

// Test component to consume the context
function TestConsumer() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? user.email : 'none'}</span>
      <button onClick={() => signIn('a@b.com', 'pass')}>Sign In</button>
      <button onClick={() => signUp('a@b.com', 'pass')}>Sign Up</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setAuthStateCallback(null);
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null } });
  });

  it('provides auth context and finishes loading', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
    });

    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('none');
  });

  it('sets user from existing session', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { email: 'test@test.com' } } },
    });

    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
    });

    expect(screen.getByTestId('user').textContent).toBe('test@test.com');
  });

  it('calls signInWithPassword on signIn', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: {}, error: null });

    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
    });

    await act(async () => {
      screen.getByText('Sign In').click();
    });

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'pass',
    });
  });

  it('calls signUp on supabase', async () => {
    mockSupabase.auth.signUp.mockResolvedValue({ data: {}, error: null });

    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
    });

    await act(async () => {
      screen.getByText('Sign Up').click();
    });

    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'pass',
    });
  });

  it('calls signOut on supabase', async () => {
    mockSupabase.auth.signOut.mockResolvedValue({ error: null });

    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
    });

    await act(async () => {
      screen.getByText('Sign Out').click();
    });

    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
  });

  it('updates user on auth state change', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
    });

    expect(screen.getByTestId('user').textContent).toBe('none');

    // Simulate auth state change
    await act(async () => {
      const cb = getAuthStateCallback();
      cb('SIGNED_IN', { user: { email: 'new@user.com' } });
    });

    expect(screen.getByTestId('user').textContent).toBe('new@user.com');
  });

  it('unsubscribes on unmount', async () => {
    let unmount;
    await act(async () => {
      const result = render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );
      unmount = result.unmount;
    });

    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
