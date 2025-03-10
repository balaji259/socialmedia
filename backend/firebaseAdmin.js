const admin = require('firebase-admin');
// const serviceAccount = require('./serviceAccountKey.json');
const dotenv = require('dotenv');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// Load environment variables
dotenv.config();

const serviceAccount = require(process.env.SERVICE_ACCOUNT_KEY_PATH );



if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       type: process.env.TYPE,
//       project_id: process.env.PROJECT_ID,
//       private_key_id: process.env.PRIVATE_KEY_ID,
//       private_key:"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEF...\n-----END PRIVATE KEY-----\n",  
//       client_email: process.env.CLIENT_EMAIL,
//       client_id: process.env.CLIENT_ID,
//       auth_uri: process.env.AUTH_URI,
//       token_uri: process.env.TOKEN_URI,
//       auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
//       client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
//     }),
//   });
// }


module.exports = admin;
