import { Router } from 'express';
import { supabase } from '../index';
import { TenantRequest } from '../middleware/tenant';

const router = Router();

router.get('/', async (req: TenantRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('id, role, user_id, created_at')
      .eq('tenant_id', req.tenantId!);

    if (error) throw error;

    const userIds = data.map(ur => ur.user_id);
    const { data: users } = await supabase.auth.admin.listUsers();

    const enrichedData = data.map(ur => {
      const user = users?.users.find(u => u.id === ur.user_id);
      return {
        ...ur,
        email: user?.email,
      };
    });

    res.json(enrichedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/invite', async (req: TenantRequest, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can invite users' });
    }

    const { email, role } = req.body;

    const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(email);

    if (authError) throw authError;

    const { data, error } = await supabase
      .from('user_roles')
      .insert({
        tenant_id: req.tenantId,
        user_id: authData.user.id,
        role,
        created_by: req.userId,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to invite user' });
  }
});

router.put('/:id/role', async (req: TenantRequest, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update roles' });
    }

    const { role } = req.body;

    const { data, error } = await supabase
      .from('user_roles')
      .update({ role })
      .eq('id', req.params.id)
      .eq('tenant_id', req.tenantId!)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

router.delete('/:id', async (req: TenantRequest, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Only admins can remove users' });
    }

    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('id', req.params.id)
      .eq('tenant_id', req.tenantId!);

    if (error) throw error;
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove user' });
  }
});

export default router;
