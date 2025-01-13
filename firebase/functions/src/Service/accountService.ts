import * as admin from 'firebase-admin';

// Khởi tạo Firebase Admin SDK
admin.initializeApp();

export const createAccount = async (username: string, email: string, password: string) => {
  try {
    // Kiểm tra nếu các thông tin được cung cấp đầy đủ
    if (!username || !email || !password) {
      throw new Error('Missing fields: username, email, or password');
    }

    // Kiểm tra xem tài khoản đã tồn tại trong Firebase Authentication chưa
    const existingUser = await admin.auth().getUserByEmail(email).catch(() => null);
    if (existingUser) {
      throw new Error('Account already exists in Firebase Auth');
    }

    // Tạo người dùng mới trong Firebase Authentication (Authentication)
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,  // Lưu username vào displayName của người dùng
    });

    // Lưu thêm thông tin tài khoản vào Firestore
    const userRef = admin.firestore().collection('users').doc(userRecord.uid);  // Lưu theo UID của người dùng Firebase Auth
    await userRef.set({
      username,
      email,
      password,  // Lưu mật khẩu chưa mã hóa - LƯU Ý: nên mã hóa mật khẩu trước khi lưu trong thực tế
    });

    console.log('Account created successfully');
    return 'Account created successfully';
  } catch (error) {
    console.error('Error creating account:', error.message);
    throw new Error(error.message);
  }
};

export const loginService = async (email: string, password: string) =>{
   try {
    if ( !email || !password) {
        throw new Error('Missing fields: email or password');
    }
      const userRecord = await admin.auth().getUserByEmail(email);
    if (!userRecord) {
        return { success: false, message: 'Account does not exist' }; // Trường hợp không tìm thấy người dùng
    }
    return { success: true, message: 'Login successful', user: { email: userRecord.email, username: userRecord.displayName } };

   } catch (error) {
    console.error('Error logging in:', error.message);
    return { success: false, message: error.message || 'Login failed' };
   }

}