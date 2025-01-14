import * as admin from 'firebase-admin';

// Tạo giao dịch mới
export const createPayment = async (amount: string, email: string, idProduct: string) => {
  try {
    // Kiểm tra giá trị `amount`
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return { success: false, message: 'Amount must be a valid positive number.' };
    }

    const time = new Date();
   
// Lấy năm, tháng, ngày, giờ, phút, giây
const year = time.getFullYear();           // Lấy năm (Full Year)
const month = time.getMonth() + 1;         // Lấy tháng (lưu ý: tháng trong `Date` bắt đầu từ 0, do đó cộng thêm 1)
const day = time.getDate();                // Lấy ngày (ngày của tháng)
const hours = time.getHours();             // Lấy giờ
const minutes = time.getMinutes();         // Lấy phút
const seconds = time.getSeconds();         // Lấy giây

    const resulttime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    const newPayment = {
      amount,
      email,
      idProduct,
      resulttime,
    };

    // Thêm giao dịch vào subcollection `transactions` của tài liệu theo email
    const paymentRef = await admin
      .firestore()
      .collection('payment') // Collection "payment"
      .doc(email) // Document với `email` làm ID
      .collection('transactions') // Subcollection "transactions"
      .add(newPayment); // Tạo tài liệu giao dịch mới

    return {
      success: true,
      message: 'Payment created successfully',
      paymentId: paymentRef.id, // ID của giao dịch trong subcollection
      data: newPayment,
    };
  } catch (error) {
    console.error('Error creating payment:', error.message);
    return { success: false, message: error.message || 'Payment creation failed' };
  }
};

// Lấy các giao dịch theo email
export const getPaymentByEmail = async (email: string) => {
  try {
    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return { success: false, message: 'The email address is improperly formatted.' };
    }

    // Tìm tất cả giao dịch của email này từ sub-collection 'transactions'
    const userRef = admin.firestore().collection('payment').doc(email).collection('transactions'); // Đảm bảo tên sub-collection là 'transactions'
    const userSnapshot = await userRef.get();

    // Kiểm tra nếu không có giao dịch nào
    if (userSnapshot.empty) {
      return { success: false, message: 'No payment records found for this email.' };
    }

    // Xử lý danh sách các giao dịch
    const payments = [];
    userSnapshot.forEach((doc) => {
      payments.push({
        id: doc.id, // ID của tài liệu
        ...doc.data(), // Thông tin chi tiết từ Firestore
      });
    });

    // Trả về danh sách giao dịch
    return {
      success: true,
      message: `Found ${payments.length} payments for this email.`,
      data: payments,
    };
  } catch (error) {
    console.error('Error fetching payment information:', error.message);
    return { success: false, message: error.message || 'An error occurred while fetching payment records.' };
  }
};
