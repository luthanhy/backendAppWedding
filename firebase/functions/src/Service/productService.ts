import * as admin from 'firebase-admin';


export const createProduct = async (image :string, brandName:string, title:string, price:string, priceAfetDiscount:string, dicountpercent:string)=>{
    try {
        const newProduct = {
            image,
            brandName,
            title,
            price,
            priceAfetDiscount: priceAfetDiscount || null,
            dicountpercent: dicountpercent || null,
          };
          await admin.firestore().collection('products').add(newProduct);
          return { success: true, message: 'add success' };

    } catch (error) {
        return { success: false, message: error.message || 'Add faile' };
    }
}

export const getAllProduct = async() =>{
    try {
        const productsSnapshot = await admin.firestore().collection('products').get();
        const productsList: any[] = [];
        productsSnapshot.forEach(doc => {
            productsList.push({ id: doc.id, ...doc.data() });
          });
          return { success: true, data: productsList };
    } catch (error) {
        console.error('Error logging in:', error.message);
        return { success: false, message: error.message || 'Gwt fail' };
    }
}