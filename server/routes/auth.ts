import { Router } from 'express';
import { supabase } from '../index';

const router = Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password, tenantName, tenantDomain } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    if (authData.user && tenantName && tenantDomain) {
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .insert({ name: tenantName, domain: tenantDomain })
        .select()
        .single();

      if (!tenantError && tenant) {
        await supabase.from('user_roles').insert({
          tenant_id: tenant.id,
          user_id: authData.user.id,
          role: 'admin',
          created_by: authData.user.id,
        });
      }
    }

    res.json({ user: authData.user, session: authData.session });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { data: tenants } = await supabase
      .from('user_roles')
      .select('tenant_id, role, tenants(id, name, domain)')
      .eq('user_id', data.user.id);

    res.json({ user: data.user, session: data.session, tenants });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

export default router;
