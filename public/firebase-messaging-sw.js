importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);


// Replace these with your own Firebase config keys...
const firebaseConfig = {
  apiKey: "AIzaSyBFQIMDiuZrt4eAZzd1yqO5vVemb1HbiCA",
  authDomain: "drawlys-notifications.firebaseapp.com",
  projectId: "drawlys-notifications",
  storageBucket: "drawlys-notifications.appspot.com",
  messagingSenderId: "421597835625",
  appId: "1:421597835625:web:32b670de64a88e8876cdf8",
  measurementId: "G-ZJWHJGD2YW"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );


  // payload.fcmOptions?.link comes from our backend API route handle
  // payload.data.link comes from the Firebase Console where link is the 'key'
  const link = payload.fcmOptions?.link || payload.data?.link;

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // icon: "./logo.png",
    // sound: "https://drawlys.com/assets/sounds/ErrorSound.mp3",
    icon: "https://drawlys.com:8444/images/logo.png",
    data: { url: link },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

});

self.addEventListener("notificationclick", function (event) {
  console.log("[firebase-messaging-sw.js] Notification click received.");

  event.notification.close();


  // This checks if the client is already open and if it is, it focuses on the tab. If it is not open, it opens a new tab with the URL passed in the notification payload
  event.waitUntil(
    clients
      // https://developer.mozilla.org/en-US/docs/Web/API/Clients/matchAll
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        const url = event.notification.data.url;
  

       

        // If relative URL is passed in firebase console or API route handler, it may open a new window as the client.url is the full URL i.e. https://example.com/ and the url is /about whereas if we passed in the full URL, it will focus on the existing tab i.e. https://example.com/about
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }



        if (clients.openWindow) {
          console.log("OPENWINDOW ON CLIENT");
          return clients.openWindow(url);
        }
      })
  );
});

