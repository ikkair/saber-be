const { google } = require('googleapis');
const fs = require('fs');

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.scripts',
  'https://www.googleapis.com/auth/drive.metadata',
];
const auth = new google.auth.GoogleAuth({
  credentials: {
    "type": process.env.GOOGLE_DRIVE_TYPE,
    "project_id": process.env.GOOGLE_DRIVE_PROJECT_ID,
    "private_key_id": process.env.GOOGLE_DRIVE_PRIVATE_KEY_ID,
    "private_key": process.env.GOOGLE_DRIVE_PRIVATE_KEY,
    "client_email": process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
    "client_id": process.env.GOOGLE_DRIVE_CLIENT_ID,
    "auth_uri": process.env.GOOGLE_DRIVE_AUTH_URI,
    "token_uri": process.env.GOOGLE_DRIVE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.GOOGLE_DRIVE_AUTH_PROVIDER,
    "client_x509_cert_url": process.env.GOOGLE_DRIVE_CLIENT_URL
  },
  scopes: SCOPES,
});

// Hit google api
const driveService = google.drive({
  version: 'v3',
  auth: auth,
});

// Parameter file
async function uploadPhoto(photo) {
  // Edit File meta data yang ada di drive
  const fileMetaData = {
    name: photo.filename,
    parents: [process.env.GOOGLE_DRIVE_PARENT_FOLDER],
  };

  // File yang akan di upload
  const media = {
    mimeType: photo.mimeType,
    body: fs.createReadStream(photo.path),
  };

  const response = await driveService.files.create({
    resource: fileMetaData,
    media: media,
    fields: 'id',
  });

  return response.data;
}

// Parameternya id
async function deletePhoto(photoId) {
  // ID File photo di google drive
  const id = photoId;
  const response = await driveService.files.delete({
    fileId: id,
  });

  return response.data;
}

// Parameternya file dan Id photo yang lama
async function updatePhoto(photo, oldPhotoId) {
    // File yang akan di upload
  const media = {
    mimeType: photo.mimeType,
    body: fs.createReadStream(photo.path),
  };

  // File yang akan di replace
  const response = await driveService.files.update({
    fileId: oldPhotoId,
    media: media,
    fields: 'id',
  });

  return response.data;
}

module.exports = {
  updatePhoto,
  deletePhoto,
  uploadPhoto
}
