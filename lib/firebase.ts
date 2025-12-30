"use client";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBftaUO-rjG1Iwz6gifUZhSHCTwIhCoLco",
  authDomain: "coneiz-web.firebaseapp.com",
  projectId: "coneiz-web",
  storageBucket: "coneiz-web.firebasestorage.app",
  messagingSenderId: "736298583760",
  appId: "1:736298583760:web:cb340f9200cbc3729a00d5",
  measurementId: "G-4QRKN1B1S0"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export { app, analytics };
