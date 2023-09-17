const multer = require("multer");
const MongoClient = require("mongodb").MongoClient;
const { GridFsStorage } = require("multer-gridfs-storage");
const {ObjectId}  = require("mongodb");
const dotenv = require("dotenv").config();
const fs = require("fs").promises;

const fileStorage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    // Extract the file information from the originalname string
    const filename = file.originalname;

    return new Promise((resolve, reject) => {
      const fileInfo = {
        filename: filename,
        bucketName: "files",
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({ storage: fileStorage });

// exports.uploadFile = (req, res) => {
//   upload.array("files")(req, res, (err) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: "Error uploading files" });
//     }
//     // console.log(req.files.map((file) => file.id));
//     res.status(200).send({ message: "File uploaded", files: req.files, fileIds: req.files.map((file) => file.id) });
//   });
// };

exports.uploadFile = (buffer, callback) => {
  // Create a mock request and response object
  console.log("Uploading FILE IN FILECONTROLLER");
  const mockReq = {
    files: [buffer], // Replace this with the actual buffer
  };
  const mockRes = {
    status: function (statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    send: function (data) {
      callback(null, data);
    },
  };

  upload.array("files")(mockReq, mockRes, (err) => {
    if (err) {
      console.error(err);
      callback(err);
    } else {
      callback(null, {
        message: "File uploaded",
        files: mockReq.files,
        fileIds: mockReq.files.map((file) => file.id),
      });
    }
  });
};


exports.pushFile = async (req, res) => {
  try {
    const { body } = req;
    const caseID = req.params.caseID;
    const fileIds = body.fileIds; // Assuming fileIds is an array of fileId strings

    // Add 'await' to the function call and use $each modifier
    const updatedCase = await Case.findByIdAndUpdate(
      new ObjectId(caseID),
      {
        $push: { fileIds: { $each: fileIds } },
      },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      status: "success",
      data: {
        case: updatedCase,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

/////////////////////////////
// FILE HANDLING           //
/////////////////////////////

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./"); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Set the file name to be saved
  },
});

const uploadFiles = multer({ storage: storage });

exports.getFileAsPlainText = async (req, res) => {
  var plainTextList = [];

  uploadFiles.array("files")(req, res, async (err) => {
    if (err) {
      res.status(400).send("Error processing files: " + err.message);
      return;
    }
    const files = req.files;
    console.log(files);
    const processingPromises = files.map(async (file) => {
      return await processFile(file);
    });

    plainTextList = await Promise.all(processingPromises);
    res.json({ plainTextList });
  });
};

