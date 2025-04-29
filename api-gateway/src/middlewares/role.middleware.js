import mongoose from "mongoose";

/**
 * Middleware to guard actions based on HTTP method and user role.
 *
 * @param {Object} permissions - e.g., { GET: ["any"], POST: ["restaurant_admin"], DELETE: ["admin"] }
 */

const looksLikeObjectId = (id) =>
  typeof id === "string" && mongoose.Types.ObjectId.isValid(id);

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

    // Allow any
    if (allowedRoles.includes("any")) return next();

    // Extract ID from known places: req.params first
    let resourceId = req.params?.id;

    // Fallback: try to get last segment from path that looks like an ObjectId
    if (!resourceId || !looksLikeObjectId(resourceId)) {
      const pathParts = req.path.split("/").filter(Boolean);
      const maybeId = pathParts.findLast((part) => looksLikeObjectId(part));
      if (maybeId) resourceId = maybeId;
    }

    console.log("User ID:", user?._id);
    console.log("Resource ID:", resourceId);

    if (
      allowedRoles.includes("owner") &&
      resourceId?.toString() === user?._id?.toString()
    ) {
      return next();
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
