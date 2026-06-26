import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: 'AIzaSyBciblx5T9ZiQ-2s5SFEl7Ws47NJ_AMkwk',
  authDomain: 'qr-timbre-app.firebaseapp.com',
  databaseURL: 'https://qr-timbre-app-default-rtdb.firebaseio.com',
  projectId: 'qr-timbre-app',
  storageBucket: 'qr-timbre-app.firebasestorage.app',
  messagingSenderId: '599097888643',
  appId: '1:599097888643:web:a3ef4454d2f631f60a30b6'
};

const app = initializeApp( firebaseConfig );

export const db = getFirestore( app );
