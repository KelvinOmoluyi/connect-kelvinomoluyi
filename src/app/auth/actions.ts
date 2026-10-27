'use server';

import { createClient } from '@/lib/supabase/server';
import { validateUsernameFormat } from '@/lib/reserved-usernames';
import { redirect } from 'next/navigation';

export interface AuthState {
  error?: string | null;
  success?: boolean;
}

/**
 * Handle user registration with unique username check
 */
export async function signUpAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const fullName = (formData.get('fullName') as string)?.trim();
  const username = (formData.get('username') as string)?.trim().toLowerCase();

  if (!email || !password || !fullName || !username) {
    return { error: 'Please fill in all required fields.' };
  }

  // 1. Username validation
  const validation = validateUsernameFormat(username);
  if (!validation.valid) {
    return { error: validation.error };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  const supabase = await createClient();

  // 2. Check if username is already taken
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .ilike('username', username)
    .maybeSingle();

  if (existingUser) {
    return { error: 'This username is already taken. Please choose another one.' };
  }

  // 3. Register user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        username,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: 'Unable to create user account. Please try again.' };
  }

  // 4. Create profile entry
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    username,
    full_name: fullName,
    email,
    is_published: true,
    show_email: true,
    show_phone: true,
    show_company: true,
    theme: 'cobalt',
  });

  if (profileError) {
    // If table insert failed due to duplication
    if (profileError.code === '23505') {
      return { error: 'Username is already taken. Please choose another.' };
    }
    // If email confirmation is required, inform user
    if (authData.session === null) {
      return {
        success: true,
        error: 'Account created! Please check your email to verify your address before logging in.',
      };
    }
  }

  redirect('/dashboard');
}

/**
 * Handle user login
 */
export async function loginAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const next = (formData.get('next') as string) || '/dashboard';

  if (!email || !password) {
    return { error: 'Please provide both email and password.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Sanitize next redirect
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
  redirect(safeNext);
}

/**
 * Log out user
 */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
