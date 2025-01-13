const FireBase = require('../config/config');

// Tạo tài khoản mới
const createAccount = async (email, password, name) => {
  try {
    // Kiểm tra người dùng đã tồn tại chưa
    const userExists = await FireBase.admin.auth().getUserByEmail(email).catch((error) => {
      return null; // Nếu không tồn tại, không có gì xảy ra
    });

    if (userExists) {
      console.log('User already exists!');
      return { message: 'User already exists!' };
    }

    // Tạo người dùng mới trên Firebase Authentication
    const userRecord = await FireBase.admin.auth().createUser({
      email: email,
      password: password, // Đảm bảo rằng bạn mã hóa mật khẩu trước khi lưu trữ
      displayName: name, // Tên hiển thị
    });

    // Lưu thông tin vào Firestore
    await FireBase.db.collection('Users').doc(userRecord.uid).set({
      email: email,
      displayName: name,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('User account created successfully!');
    return { message: 'User account created successfully!', uid: userRecord.uid };
  } catch (error) {
    console.error('Error creating account:', error);
    return { message: `Error creating account: ${error.message}` };
  }
};

module.exports = { createAccount };
