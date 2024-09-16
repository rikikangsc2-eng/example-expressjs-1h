const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { writeFile } = require('fs').promises;
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const { fromBuffer } = require('file-type');

const uploadToCustomAPI = async (buffer, fileName) => {
  try {
    const form = new FormData();
    form.append('file', buffer, fileName); // Append the buffer directly

    const response = await axios.post('https://poised-broad-koi.glitch.me/upload', form, {
      headers: form.getHeaders()
    });

    return response.data; // Return API response
  } catch (error) {
    console.error('Terjadi kesalahan saat mengunggah ke API:', error.message);
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
      fileName = `${m.pushName || m.sender}.jpeg`;
      break;
    case 'videoMessage':
      fileExtension = 'mp4';
      fileName = `${m.pushName || m.sender}.mp4`;
      break;
    default:
      throw new Error('Invalid messageType');
  }

  const buffer = await downloadMediaMessage(m, 'buffer', {}, {
    reuploadRequest: client.updateMediaMessage
  });

  // Upload directly without saving to a file
  const hasil = await uploadToCustomAPI(buffer, fileName);

  return hasil.file; // Assuming API response contains the 'files' field as a URL
}

module.exports = { get }
  
