import multer from "multer"; // import external middleware
import { logger } from "../utils/logger/index.js";
import fs from "fs";
import { UnsupportedFileError } from "../models/errors/UnsupportedFile.error.js";

// Function to ensure the directory exists
function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Function to check file type
function checkFileType(fileTypes) {
  return function (req, file, cb) {
    if (!fileTypes.includes(file.mimetype)) {
      req.fileValidationError = "Forbidden extension";
      return cb(null, false, req.fileValidationError); // Reject file
    }
    cb(null, true); // Accept file
  };
}

// MULTER CONFIG
function dynamicStorage(folder, fileTypes, maxSize) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const destPath = `./static/${folder}`;
      ensureDirExists(destPath);
      cb(null, destPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      logger.debug("Storing file using multer");
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });

  const fileFilter = checkFileType(fileTypes);
  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * maxSize },
  });
}

export function uploadFile(folder, fileTypes,maxSize,fieldname,maxCount) {
  return (req, res, next) => {
    const upload = dynamicStorage(folder, fileTypes,maxSize).array(fieldname, maxCount);
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        err = new UnsupportedFileError(err.message);
        return next(err);
      } else if (err) {
        return next(err);
      }
      // Filter Error hardcoded in req
      if (req.fileValidationError) {
        let err = new UnsupportedFileError(req.fileValidationError);
        return next(err);
      }
      //everything went fine
      next();
    });
  };
}
