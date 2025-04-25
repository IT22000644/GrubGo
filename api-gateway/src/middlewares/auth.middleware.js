import { USER_SERVICE_URL } from "../config/index.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing or malformed token" });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token using auth service
    const verifyResponse = await axios.post(
      `${process.env.AUTH_SERVICE_URL}/auth/verify-token`,
      { token }
    );

    if (!verifyResponse.data.success) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const decodedToken = verifyResponse.data.data;

    // Get user info from user service
    const userResponse = await axios.get(
      `${USER_SERVICE_URL}/users/${decodedToken.userId}`
    );

    if (!userResponse.data.success || !userResponse.data.data.isVerified) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Inactive or unverified user" });
    }

    // Attach user info to request
    req.user = userResponse.data.data;

    next();
  } catch (err) {
    console.error("[❌] Auth Middleware Error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
