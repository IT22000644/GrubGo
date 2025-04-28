import axios from "axios";
import { AUTH_SERVICE_URL, USER_SERVICE_URL } from "../config/index.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing or malformed token" });
    }

    const token = authHeader.split(" ")[1];

    const verifyResponse = await axios.post(
      `${AUTH_SERVICE_URL}/verify-token`,
      { token }
    );

    if (!verifyResponse.data.success) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const decodedToken = verifyResponse.data.data;

    const userResponse = await axios.get(
      `${USER_SERVICE_URL}/${decodedToken.userId}`
    );

    if (!userResponse.data.success || !userResponse.data.data.isVerified) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Inactive or unverified user" });
    }
    req.user = userResponse.data.data;
    next();
  } catch (err) {
    console.error("[❌] Auth Middleware Error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
