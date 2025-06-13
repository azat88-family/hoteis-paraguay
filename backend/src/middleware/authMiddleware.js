// backend/src/middleware/authMiddleware.js
const { supabase } = require('../config/supabaseClient.js'); // Use CommonJS require

/**
 * Middleware to protect routes by verifying a JWT token.
 * It extracts the user information from Supabase using the token.
 * Note: For robust backend token validation independent of RLS,
 * using supabase.auth.api.getUser(token) with a SERVICE_ROLE_KEY is recommended.
 * This current implementation relies on the anon key's ability to get user info,
 * which might be restricted by RLS or require specific policies.
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split(' ')[1];
    } catch (error) {
      console.error('Error splitting authorization header:', error);
      return res.status(401).json({ message: 'Not authorized, token format invalid' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    // supabase.auth.getUser(token) with an anon key fetches the user profile based on RLS.
    // If the token is valid and the user's row is accessible, it returns the user.
    // For a true "token validation" in the backend, you would typically use the admin API
    // with a service role key: supabase.auth.api.getUserByToken(token) or similar.
    // This approach assumes the token is already validated by a gateway or Supabase itself,
    // and we are primarily retrieving the user's session/details.
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Supabase auth error:', error.message);
      return res.status(401).json({ message: `Not authorized, token failed: ${error.message}` });
    }

    if (!user) {
      // This case might happen if RLS prevents access or token is simply invalid for any user
      return res.status(401).json({ message: 'Not authorized, no user found for this token or RLS prevented access.' });
    }

    req.user = user; // Attach user to request object (includes id, email, user_metadata)
    next();
  } catch (error) {
    console.error('Generic error in protect middleware:', error);
    return res.status(401).json({ message: 'Not authorized, token invalid or server error' });
  }
};

/**
 * Middleware to authorize users based on their roles.
 * Assumes req.user has been populated by the 'protect' middleware
 * and that user roles are stored in user.user_metadata.role.
 *
 * @param  {...string} roles - A list of roles allowed to access the route.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.user_metadata) {
      return res.status(403).json({ message: 'User metadata not found, cannot ascertain role.' });
    }

    const userRole = req.user.user_metadata.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({
        message: `Forbidden: Your role ('${userRole || 'undefined'}') is not authorized to access this resource.`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
