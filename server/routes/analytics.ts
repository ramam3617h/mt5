import { Router } from 'express';
import { supabase } from '../index';
import { TenantRequest } from '../middleware/tenant';

const router = Router();

router.get('/dashboard', async (req: TenantRequest, res) => {
  try {
    const { data: customers } = await supabase
      .from('customers')
      .select('status')
      .eq('tenant_id', req.tenantId!);

    const { data: activities } = await supabase
      .from('activities')
      .select('created_at')
      .eq('tenant_id', req.tenantId!)
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const { data: users } = await supabase
      .from('user_roles')
      .select('role')
      .eq('tenant_id', req.tenantId!);

    const statusCounts = {
      lead: 0,
      prospect: 0,
      active: 0,
      inactive: 0,
    };

    customers?.forEach(c => {
      statusCounts[c.status as keyof typeof statusCounts]++;
    });

    const analytics = {
      totalCustomers: customers?.length || 0,
      totalActivities: activities?.length || 0,
      totalUsers: users?.length || 0,
      customersByStatus: statusCounts,
      recentActivitiesCount: activities?.length || 0,
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
