import multer from "multer";
import path from "path";

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Where images will be saved
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get the file extension
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`; // Generate unique file name
    cb(null, uniqueName); // Save the file with the generated name
  },
});

// Error handling middleware for Multer errors
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File is too large. Max file size is 5MB",
      });
    }
    return res.status(400).json({
      message: `Multer Error: ${err.message}`,
    });
  }
  next(err);
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const mime = allowedTypes.test(file.mimetype);
    const ext = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mime && ext) return cb(null, true); // Allow file
    cb(new Error("Only images are allowed")); // Reject invalid file types
  },
});
