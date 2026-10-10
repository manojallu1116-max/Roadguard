export function requireApprovedAuthority(req, res, next) {
  const isAdmin = req.user?.role === 'admin' || req.user?.role === 'authority';
  if (!isAdmin || !req.user.isApproved) {
    return res.status(403).json({ error: 'Approved admin access is required' });
  }
  next();
}
