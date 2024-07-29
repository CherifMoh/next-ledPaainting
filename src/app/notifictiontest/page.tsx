"use client";

import { useState } from "react";
// import { Button } from "@/components/ui/button";
import useFcmToken from "../../hooks/useFcmToken";

export default function Home() {
  const { token, notificationPermissionStatus } = useFcmToken();
  const [action, setAction] = useState<string>('');

  const handleTestNotification = async () => {
    // console.log("handleTestNotification", token);
    const response = await fetch("api/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        title: "Test Notification",
        message: "This is a test notification",
        link: "/admin/orders",
      }),
    });

    setAction("Notification sent!");
    const data = await response.json();
    console.log(data);
  };




  return (
    <main className="p-10">
      <h1 className="text-4xl mb-4 font-bold">Firebase Cloud Messaging Demo</h1>

      {notificationPermissionStatus === "granted" ? (
        <p>Permission to receive notifications has been granted.</p>
      ) : notificationPermissionStatus !== null ? (
        <p>
          You have not granted permission to receive notifications. Please
          enable notifications in your browser settings.
        </p>
      ) : null}

      {/* {action && <p>{action}</p>} */}
      {token && <p>{token}</p>}

      <button
        disabled={!token}
        className="mt-5 bg-black text-white rounded-lg text-center px-8 py-4"
        onClick={()=>{
          handleTestNotification()
          setAction('clicked')
        }}
      >
        Send Test Notification
      </button>
    </main>
  );
}
