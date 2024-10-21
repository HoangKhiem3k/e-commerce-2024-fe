importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js')

const firebaseConfig = {
  apiKey: 'AIzaSyCZunS5zvZCK8CBqSg53dm7yZaMIont-o4',
  authDomain: 'shop-fe-nextjs.firebaseapp.com',
  projectId: 'shop-fe-nextjs',
  storageBucket: 'shop-fe-nextjs.appspot.com',
  messagingSenderId: '71498404290',
  appId: '1:71498404290:web:103e145f16ffcdf7a3c65b',
  measurementId: 'G-Z6FS2VH6M3'
}
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig)
// eslint-disable-next-line no-undef
const messaging = firebase.messaging()
messaging.onBackgroundMessage(payload => {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo.png'
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})
