"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import "../styles/top.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faGear, faPerson, faQuestion, faSearch } from "@fortawesome/free-solid-svg-icons";
import Notification from "./notification";
import { useTheme } from "../Context/ThemeContext";

const Top = () => {
  const [width, setWidth] = useState("top");
  const adjust = () => {
    setWidth("top adjust");
  };

  const [mode, setMode] = useState("light");
  const [notifications, setNotifications] = useState(3); // Example: 3 unread notifications
  const { theme, toggleTheme } = useTheme();
  console.log(theme,width);
  

  useEffect(() => {
    const savedMode = localStorage.getItem("mode") || "light";
    setMode(savedMode);
    document.body.classList.toggle("dark", savedMode === "dark");
  }, []);

  return (
    <>
      <div className={`${width} ${theme}`} style={{ width: 100 + "%", left: 0 + "px", }}>
        <div className="logo-name-cont">
          <div className="logo-image">
            <Image src="/image/logo-aviato.png" alt="" width={50} height={50} />
          </div>

          <span className={`logo_name ${theme}`}>Sub<span>Hub</span>247</span>
        </div>
     

        <div className={`search-box ${theme}`}>
          <FontAwesomeIcon
            className="uil uil-search position"
            icon={faSearch}
          />
          <input type="text" placeholder="Search here..." />
        </div>

        <div className="header-cont">

        <li className="nav-item dropdown">
          <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
            <FontAwesomeIcon className={`icon ${theme}`} icon={faBell} />
            <span className=" bg-primary badge-number">4</span>
          </a>

          <ul
            className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications"
            style={{ width: 400 + "px" }}
          >
            <li className="dropdown-header">
              You have 4 new notifications
              <a href="/dashboard/notification">
                <span className="view-all rounded-pill bg-primary p-2 ms-2">
                  View all
                </span>
              </a>
            </li>
           
              <hr className="dropdown-divider" />
           
            <Notification
              title="Lorem Ipsum"
              message="Quae dolorem earum veritatis oditseno"
              time="30 min. aga"
            />
           
              <hr className="dropdown-divider" />
           
            <Notification
              title="Lorem Ipsum"
              message="Quae dolorem earum veritatis oditseno"
              time="1 hrs. aga"
            />
           
              <hr className="dropdown-divider" />
           
            <Notification
              title="Lorem Ipsum"
              message="Quae dolorem earum veritatis oditseno"
              time="2 hrs. aga"
            />
           
              <hr className="dropdown-divider" />
           
            <Notification
              title="Lorem Ipsum"
              message="Quae dolorem earum veritatis oditseno"
              time="4 hrs. aga"
            />

           
              <hr className="dropdown-divider" />
           
            <li className="dropdown-footer">
              <a href="/dashboard/notification">Show all notifications</a>
            </li>
          </ul>
        </li>
        <FontAwesomeIcon
          className="uil uil-bars sidebar-toggle icon"
          icon={faBars}
          onClick={adjust}
        />
        <div className="dropdown px-3">
          <div
            className="nav-link dropdown-toggle"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            >
            {/* <img src="images/medium-shot-happy-man-smiling.jpg" className="profile-image img-fluid" alt=""> */}
            <Image
              src="/image/profile.jpg"
              alt=""
              width={50}
              height={50}
              className="profile"
              />

            <ul className="dropdown-menu bg-white shadow">
              <li>
                <div className="dropdown-menu-profile-thumb d-flex">
                  <Image
                    src="/image/profile.jpg"
                    alt=""
                    width={50}
                    height={50}
                    />
                  {/* <img src="images/medium-shot-happy-man-smiling.jpg" className="profile-image img-fluid me-3" alt=""> */}

                  <div className="d-flex flex-column">
                    <div className="small">
                      <small>Thomas</small>
                    </div>
                    <div className="mail">
                      <a href="mail:thomas@site.com ">thomas@site.com</a>
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <a className="dropdown-item" href="/dashboard/profile">
                  <FontAwesomeIcon className="bi-person me-2" icon={faPerson}/>
                  Profile
                </a>
              </li>

              <li>
                <a className="dropdown-item" href="/dashboard/settings">
                  <FontAwesomeIcon className="bi-gear me-2" icon={faGear}/>
                  Settings
                </a>
              </li>

              <li>
                <a className="dropdown-item" href="/dashboard/help_center">
                  <FontAwesomeIcon className="bi-question-circle me-2" icon={faQuestion} />
                  Help
                </a>
              </li>
              <hr />
              <li className="border-top mt-3 pt-2 mx-4">
                <a className="dropdown-item ms-0 me-0" href="/login">
                  <i className="bi-box-arrow-left me-2"></i>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
                    </div>
      </div>
    </>
  );
};

export default Top;
