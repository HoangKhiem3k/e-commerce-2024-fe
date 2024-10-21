// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyCZunS5zvZCK8CBqSg53dm7yZaMIont-o4',
  authDomain: 'shop-fe-nextjs.firebaseapp.com',
  projectId: 'shop-fe-nextjs',
  storageBucket: 'shop-fe-nextjs.appspot.com',
  messagingSenderId: '71498404290',
  appId: '1:71498404290:web:103e145f16ffcdf7a3c65b',
  measurementId: 'G-Z6FS2VH6M3'
}
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
export default firebaseApp
