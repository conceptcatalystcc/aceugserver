var admin = require("firebase-admin");
const getAuth = require("firebase-admin/auth").getAuth;

var serviceAccount = require("./aceug-test-firebase-adminsdk-jxmbt-0ed5232b11.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = getAuth(app);

module.exports = auth;
