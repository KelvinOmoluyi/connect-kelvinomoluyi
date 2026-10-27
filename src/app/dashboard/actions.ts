'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { CardTheme, SocialPlatform } from '@/lib/types';

export interface ActionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Toggle profile publish status
 */
export async function togglePublishAction(isPublished: boolean): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized. Please sign in.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ is_published: isPublished })
    .eq('id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  return {
    success: true,
    message: isPublished ? 'Your card is now live and scannable!' : 'Your card is now private.',
  };
}

/**
 * Update profile fields & visibility flags
 */
export async function updateProfileAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized. Please sign in.' };
  }

  const fullName = (formData.get('fullName') as string)?.trim();
  const headline = (formData.get('headline') as string)?.trim() || null;
  const bio = (formData.get('bio') as string)?.trim() || null;
  const company = (formData.get('company') as string)?.trim() || null;
  const phone = (formData.get('phone') as string)?.trim() || null;
  const email = (formData.get('email') as string)?.trim() || null;
  const avatarUrl = (formData.get('avatarUrl') as string)?.trim() || null;
  const theme = (formData.get('theme') as CardTheme) || 'cobalt';

  const showPhone = formData.get('showPhone') === 'on' || formData.get('showPhone') === 'true';
  const showEmail = formData.get('showEmail') === 'on' || formData.get('showEmail') === 'true';
  const showCompany = formData.get('showCompany') === 'on' || formData.get('showCompany') === 'true';

  if (!fullName) {
    return { success: false, error: 'Full name cannot be empty.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      headline,
      bio,
      company,
      phone,
      email,
      avatar_url: avatarUrl,
      theme,
      show_phone: showPhone,
      show_email: showEmail,
      show_company: showCompany,
    })
    .eq('id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/edit');
  return { success: true, message: 'Profile details saved successfully.' };
}

/**
 * Add or update a profile link
 */
export async function saveProfileLinkAction(linkData: {
  id?: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  is_active: boolean;
  sort_order: number;
}): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized.' };
  }

  if (!linkData.url || !linkData.label) {
    return { success: false, error: 'Label and URL are required.' };
  }

  // Ensure URL has http/https protocol
  let sanitizedUrl = linkData.url.trim();
  if (!/^https?:\/\//i.test(sanitizedUrl)) {
    sanitizedUrl = `https://${sanitizedUrl}`;
  }

  if (linkData.id) {
    // Update existing link
    const { error } = await supabase
      .from('profile_links')
      .update({
        platform: linkData.platform,
        label: linkData.label.trim(),
        url: sanitizedUrl,
        is_active: linkData.is_active,
        sort_order: linkData.sort_order,
      })
      .eq('id', linkData.id)
      .eq('profile_id', user.id);

    if (error) return { success: false, error: error.message };
  } else {
    // Insert new link
    const { error } = await supabase.from('profile_links').insert({
      profile_id: user.id,
      platform: linkData.platform,
      label: linkData.label.trim(),
      url: sanitizedUrl,
      is_active: linkData.is_active,
      sort_order: linkData.sort_order,
    });

    if (error) return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/edit');
  return { success: true, message: 'Link saved.' };
}

/**
 * Delete a profile link
 */
export async function deleteProfileLinkAction(linkId: string): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized.' };
  }

  const { error } = await supabase
    .from('profile_links')
    .delete()
    .eq('id', linkId)
    .eq('profile_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/edit');
  return { success: true, message: 'Link removed.' };
}
