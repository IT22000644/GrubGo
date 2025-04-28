/**
 * Middleware to guard actions based on HTTP method and user role.
 *
 * @param {Object} permissions - e.g., { GET: ["any"], POST: ["restaurant_admin"], DELETE: ["admin"] }
 */

export const actionGuard = (permissions = {}) => {
  return (req, res, next) => {
    const method = req.method.toUpperCase();
    const user = req.user;

    const allowedRoles = permissions[method];

    if (!allowedRoles) {
      return res.status(405).json({
        success: false,
        message: `Method ${method} not allowed`,
      });
    }

    if (allowedRoles.includes("any")) {
      return next();
    }

    if (allowedRoles.includes("owner")) {
      const pathParts = req.path.split("/");
      const id = pathParts[pathParts.length - 1];
      console.log("User ID:", user._id);
      console.log("Param ID:", id);
      if (id?.toString() === user._id?.toString()) {
        return next();
      }
    }

    if (user && allowedRoles.includes(user.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  };
};

export default actionGuard;
