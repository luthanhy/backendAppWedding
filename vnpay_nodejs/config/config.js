const admin = require('firebase-admin');

// Khởi tạo Firebase Admin SDK
const serviceAccount = require('./abcd-4b368-firebase-adminsdk-sdj63-2a042e99e4.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Chỉ cần `databaseURL` nếu bạn sử dụng Realtime Database
  databaseURL: "https://console.firebase.google.com/u/0/project/abcd-4b368/firestore",  // Cập nhật đúng URL của bạn nếu dùng Realtime Database
  // Nếu bạn chỉ sử dụng Firestore thì không cần `databaseURL` 
});

// Truy cập Firestore (Firestore không cần `databaseURL`, chỉ cần khởi tạo Firebase Admin)
const db = admin.firestore();

module.exports = {
  admin,
  db
};
