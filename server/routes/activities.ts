import { Router } from 'express';
import { supabase } from '../index';
import { TenantRequest } from '../middleware/tenant';

const router = Router();

router.get('/', async (req: TenantRequest, res) => {
  try {
    const customerId = req.query.customer_id as string;

    let query = supabase
      .from('activities')
      .select('*, customer:customers(name), user:auth.users(email)')
      .eq('tenant_id', req.tenantId!);

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

router.post('/', async (req: TenantRequest, res) => {
  try {
    const { customer_id, type, subject, description } = req.body;

    const { data, error } = await supabase
      .from('activities')
      .insert({
        tenant_id: req.tenantId,
        customer_id,
        user_id: req.userId,
        type,
        subject,
        description,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

export default router;
