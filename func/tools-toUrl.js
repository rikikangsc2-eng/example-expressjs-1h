const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { writeFile } = require('fs').promises;
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const fetch = require('node-fetch');
const { fromBuffer } = require('file-type');

const uploadToCatbox = async (buffer) => {
  try {
    const { ext } = await fromBuffer(buffer);
    const bodyForm = new FormData();
    bodyForm.append("fileToUpload", buffer, `file.${ext}`);
    bodyForm.append("reqtype", "fileupload");

    const response = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: bodyForm,
    });

    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Terjadi kesalahan saat mengunggah ke Catbox:', error.message);
    throw error;
  }
}

const get = async (m, client) => {
  let fileExtension;
  let fileName;
  const messageType = m.mtype;

  switch (messageType) {
    case 'imageMessage':
      fileExtension = 'jpeg';
      fileName = 'tmp/user.jpeg';
      break;
    case 'videoMessage':
      fileExtension = 'mp4';
      fileName = 'tmp/user.mp4';
      break;
    default:
      throw new Error('Invalid messageType');
  }

  const buffer = await downloadMediaMessage(m, 'buffer', {}, {
    reuploadRequest: client.updateMediaMessage
  });

  await writeFile(`./${fileName}`, buffer);  // Save buffer to file for consistency with original logic

  const hasil = await uploadToCatbox(buffer);  // Upload the buffer directly
  fs.unlinkSync(fileName);  // Clean up the temporary file

  return hasil;
}

module.exports = { get }
  
