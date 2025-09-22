import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { seed_id, timezone, bug_report, session_duration, additional_info } = req.body;

    // console.log('Incoming payload:', req.body);

    const sessionDurationInt = Number(session_duration) || 0;

    const { data, error } = await supabase.from('seedfinder_logs').insert([
      {
        seed_id,
        timezone,
        bug_report,
        session_duration: sessionDurationInt,
        additional_info,
      },
    ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Inserted data:', data);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
