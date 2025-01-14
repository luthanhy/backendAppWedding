import * as admin from 'firebase-admin';

// Khởi tạo Firebase Admin SDK
admin.initializeApp();

export const getUserInfoByEmail = async (email: string) => {
  try {
    // Kiểm tra email có hợp lệ hay không
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return { success: false, message: 'The email address is improperly formatted.' };
    }

    // Tìm người dùng trong Firebase Authentication
    const userRecord = await admin.auth().getUserByEmail(email);

    if (!userRecord) {
      return { success: false, message: 'User not found' };
    }

    // Tìm thêm thông tin người dùng trong Firestore (nếu cần)
    const userRef = admin.firestore().collection('users').doc(userRecord.uid);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      return {
        success: true,
        message: 'User found in Authentication, but no additional data in Firestore',
        data: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
        },
      };
    }

    // Trả về thông tin người dùng từ cả Authentication và Firestore
    return {
      success: true,
      message: 'User information retrieved successfully',
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        additionalData: userSnapshot.data(),
      },
    };
  } catch (error) {
    console.error('Error fetching user information:', error.message);
    return { success: false, message: error.message };
  }
};


export const createAccount = async (username: string, email: string, password: string) => {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex
    // Kiểm tra nếu các thông tin được cung cấp đầy đủ
    if (!username || !email || !password) {
        return { success: false, message: 'Missing fields: username, email, or password' };
    }
    if (!emailRegex.test(email)) {
        return { success: false, message: 'The email address is improperly formatted.' };
    }

    // Kiểm tra xem tài khoản đã tồn tại trong Firebase Authentication chưa
    const existingUser = await admin.auth().getUserByEmail(email).catch(() => null);
    if (existingUser) {
        return { success: false, message: 'Account already exists' };
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
    return { success: true, message: 'Account created successfully' };
  } catch (error) {
    console.error('Error creating account:', error.message);
    throw new Error(error.message);
  }
};

export const loginService = async (email: string, password: string) =>{
   try {
    if ( !email || !password) {
        return { success: false, message: 'Miissing fields: email or password' }; // Trường hợp không tìm thấy người dùng
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