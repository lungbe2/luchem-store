import { getAdminClient } from '../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return res.status(500).json({ error: 'Supabase admin client is not configured' });
  }

  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) {
    return res.status(401).json({ error: 'Missing authentication token' });
  }

  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData?.user) {
    return res.status(401).json({ error: 'Invalid authentication token' });
  }

  const { full_name, phone, default_town_id, default_address } = req.body || {};

  const { error } = await supabase
    .from('user_profiles')
    .upsert({
      id: authData.user.id,
      full_name: full_name || authData.user.user_metadata?.full_name || '',
      phone: phone || null,
      default_town_id: default_town_id || null,
      default_address: default_address || null,
      updated_at: new Date().toISOString()
    });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
