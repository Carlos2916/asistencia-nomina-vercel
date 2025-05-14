import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password, nombre, sucursal } = req.body;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) return res.status(400).json({ error });

  await supabaseAdmin.from('usuarios').insert({
    id: data.user.id,
    email,
    nombre,
    rol: 'usuario',
    sucursal
  });

  res.status(200).json({ ok: true });
}
