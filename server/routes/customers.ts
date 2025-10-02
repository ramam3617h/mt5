import { Router } from 'express';
import { supabase } from '../index';
import { TenantRequest } from '../middleware/tenant';

const router = Router();

router.get('/', async (req: TenantRequest, res) => {
  try {
    let query = supabase
      .from('customers')
      .select('*, assigned_user:assigned_to(id, email)')
      .eq('tenant_id', req.tenantId!);

    if (req.userRole === 'sales' || req.userRole === 'support') {
      query = query.eq('assigned_to', req.userId!);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

router.get('/:id', async (req: TenantRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*, assigned_user:assigned_to(id, email), activities(*)')
      .eq('id', req.params.id)
      .eq('tenant_id', req.tenantId!)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

router.post('/', async (req: TenantRequest, res) => {
  try {
    if (!['admin', 'manager', 'sales'].includes(req.userRole!)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const { name, email, phone, company, status, assigned_to } = req.body;

    const { data, error } = await supabase
      .from('customers')
      .insert({
        tenant_id: req.tenantId,
        name,
        email,
        phone,
        company,
        status,
        assigned_to,
        created_by: req.userId,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

router.put('/:id', async (req: TenantRequest, res) => {
  try {
    const { name, email, phone, company, status, assigned_to } = req.body;

    const { data, error } = await supabase
      .from('customers')
      .update({ name, email, phone, company, status, assigned_to })
      .eq('id', req.params.id)
      .eq('tenant_id', req.tenantId!)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

router.delete('/:id', async (req: TenantRequest, res) => {
  try {
    if (!['admin', 'manager'].includes(req.userRole!)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', req.params.id)
      .eq('tenant_id', req.tenantId!);

    if (error) throw error;
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export default router;
