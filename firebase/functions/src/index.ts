/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {createAccount,loginService,getUserInfoByEmail} from "./Service/accountService";
import {createProduct,getAllProduct} from "./Service/productService";
import {createPayment,getPaymentByEmail} from './Service/paymentService';
import * as functions from 'firebase-functions';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript



export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const GetUserInfoByEmail = functions.https.onRequest(async (request,response)=>{
  
  const {  email } = request.body;
  try {
    const result = await getUserInfoByEmail( email);
     response.status(200).send(result);  
  }catch(error){
    console.error('Error:', error.message);
     response.status(500).send(error.message);
  }
});

export const RegisterAcount = functions.https.onRequest(async (request,response)=>{
  
  const { username, email, password } = request.body;
  try {
    const result = await createAccount(username, email, password);
     response.status(200).send(result);  // Trả về kết quả
  }catch(error){
    console.error('Error:', error.message);
     response.status(500).send(error.message);
  }
});

export const LoginService =  functions.https.onRequest(async (request,response)=>{
  
  const { email, password } = request.body;
  try {
    const result = await loginService( email, password);
     response.status(200).send(result);  // Trả về kết quả
  }catch(error){
    console.error('Error:', error.message);
     response.status(500).send(error.message);
  }
});

export const CreateProduct = functions.https.onRequest(async (request,response)=>{
  const { image, brandName, title,description, price, priceAfetDiscount, dicountpercent } = request.body;
  try {
    if (!image || !brandName || !title || !price) {
       response.status(400).send('Missing required fields');
    }
    const result = await createProduct(image, brandName, title,description, price, priceAfetDiscount, dicountpercent );
    response.status(200).send(result);
  } catch (error) {
    console.error('Error:', error.message);
     response.status(500).send(error.message);
  }
});

export const GetAllProduct =  functions.https.onRequest(async (request,response)=>{
  try {
    const result = await getAllProduct( );
    response.status(200).send(result);
  } catch (error) {
    console.error('Error:', error.message);
     response.status(500).send(error.message);
  }
});

export const GetPaymentByEmail =  functions.https.onRequest(async (request,response)=>{
  const {  email } = request.body;
  try {
    const result = await getPaymentByEmail(email);
    response.status(200).send(result);
  } catch (error) {
    console.error('Error:', error.message);
     response.status(500).send(error.message);
  }
});
export const CreatePayment =  functions.https.onRequest(async (request,response)=>{
  const { amount, email, idProduct } = request.body;
  try {
    const result = await createPayment(amount, email, idProduct);
    response.status(200).send(result);
  } catch (error) {
    console.error('Error:', error.message);
     response.status(500).send(error.message);
  }
});