
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBiuT-SormhQ4MafKwxKf2ofKo7ZFouv98",
    authDomain: "kagaj-fe973.firebaseapp.com",
    projectId: "kagaj-fe973",
    storageBucket: "kagaj-fe973.appspot.com",
    messagingSenderId: "578427920981",
    appId: "1:578427920981:web:092db7db89653b7754eadc",
    measurementId: "G-1E7PDMQYBP"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const storage = getStorage(app);

export default storage;