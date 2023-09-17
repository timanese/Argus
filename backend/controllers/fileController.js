const multer = require("multer");
// const MongoClient = require("mongodb").MongoClient;
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

const { MongoClient, GridFSBucket } = require('mongodb');

exports.uploadFile = async (buffer, filename) => {
    const client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db('Argus');
    const bucket = new GridFSBucket(db, {
      bucketName: 'files'
    });

  const uploadStream = bucket.openUploadStream(filename);
  const id = uploadStream.id;

  uploadStream.write(buffer, (error) => {
    if (error) {
      console.error('Error writing to GridFS', error);
      client.close();
      return;
    }

    uploadStream.end(() => {
      console.log('File uploaded successfully');
      client.close();
    });
  });

  return id;
};

exports.getFileById = async (fileId) => {
  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db('Argus');
  const bucket = new GridFSBucket(db, {
    bucketName: 'files'
  });

  const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));
  let chunks = [];

  return new Promise((resolve, reject) => {
    downloadStream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    downloadStream.on('error', (error) => {
      console.error('Error fetching file:', error);
      client.close();
      reject(error);
    });

    downloadStream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      client.close();
      resolve(buffer);
    });
  });
};