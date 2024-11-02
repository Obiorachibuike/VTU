"use client";
import React, { useState } from "react";
import "../styles/Settings.css";
import Image from "next/image";
import UpdateUser from "./settings/update_user";
import UpdatePassword from "./settings/update_password";
import UpdateNotification from "./settings/update_notification";

function Settings() {
 
  const [profile, setProfile] = useState("fade show active");
  const [password, setPassword] = useState("fade show active tab-pane");
  const [notification, setNotification] = useState("fade show active tab-pane");
  const [profileActive, setProfileActive] = useState("nav-link active");
  const [passwordActive, setPasswordActive] = useState("nav-link");
  const [notificationActive, setNotificationActive] = useState("nav-link");

 



  const loadFile = (e: any) => {
    const file = e.target.files[0];
    // const 
    const read = file.FileReader;
    console.log(read);

    const { name } = file;
    // console.log(file.name);
   
    // setImg(read);
  };
  const profileForm = () => {
    setProfile("fade show active");
    setNotification("fade show active tab-pane");
    setPassword("fade show active tab-pane");
    setPasswordActive("nav-link")
    setProfileActive("nav-link active")
    setNotificationActive("nav-link")
  };
  const passwordForm = () => {
    setProfile("fade show active tab-pane");
    setNotification("fade show active tab-pane");
    setPassword("fade show active ");
    setPasswordActive("nav-link active")
    setNotificationActive("nav-link")
    setProfileActive("nav-link")
  };
  const notificationForm = () => {
    setProfileActive("nav-link")
   
    setProfile("fade show active tab-pane");
    setNotification("fade show active ");
    setPassword("fade show active tab-pane");
    setNotificationActive("nav-link active")
    setPasswordActive("nav-link")
  };

  return (
    <>
      <div className="row my-4">
        <div className="col-lg-7 col-12">
          <div className="custom-block bg-white">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={profileActive}
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="profile-tab-pane"
                  aria-selected="true"
                  onClick={profileForm}
                >
                  Profile
                </button>
              </li>

              <li className="nav-item" role="presentation">
                <button
                  className={passwordActive}
                  id="password-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#password-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="password-tab-pane"
                  aria-selected="false"
                  onClick={passwordForm}
                >
                  Password
                </button>
              </li>

              <li className="nav-item" role="presentation">
                <button
                  className={notificationActive}
                  id="notification-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#notification-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="notification-tab-pane"
                  aria-selected="false"
                  onClick={notificationForm}
                >
                  Notification
                </button>
              </li>
            </ul>

            <div className="tab-content" id="myTabContent">
              <UpdateUser profile={profile}  />

              <UpdatePassword password={password}/>

            <UpdateNotification notification={notification}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
