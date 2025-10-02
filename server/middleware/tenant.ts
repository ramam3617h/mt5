import { Response, NextFunction } from 'express';
import { supabase } from '../index';
import { AuthRequest } from './auth';

export interface TenantRequest extends AuthRequest {
  tenantId?: string;
  userRole?: string;
}

export const tenantMiddleware = async (
  req: TenantRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    const { data: userRole, error } = await supabase
      .from('user_roles')
      .select('role, tenant_id')
      .eq('user_id', req.userId)
      .eq('tenant_id', tenantId)
      .maybeSingle();

    if (error || !userRole) {
      return res.status(403).json({ error: 'Access denied to this tenant' });
    }

    req.tenantId = tenantId;
    req.userRole = userRole.role;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Tenant verification failed' });
  }
};
