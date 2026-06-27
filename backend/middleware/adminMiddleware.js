/**
 * Restricts a route to admin users. Must be used AFTER `protect`.
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin access required' });
};

/**
 * Generic role gate factory.  Usage: roles('admin', 'instructor')
 */
export const roles = (...allowed) => (req, res, next) => {
  if (req.user && allowed.includes(req.user.role)) return next();
  return res.status(403).json({ message: 'Insufficient privileges' });
};

export default admin;
