import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Hole alle Einträge für heute
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('date', today)
      .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const { name, time, gym } = req.body;

    if (!name || !time) {
      return res.status(400).json({ error: 'Name und Zeit sind Pflicht.' });
    }

    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from('entries')
      .insert([{ name, time, gym, date: today }])
      .select();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json(data[0]);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
