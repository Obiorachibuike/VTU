"use client";
import Image from "next/image";
import "../styles/side_nav.css";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faChartArea,
  faComment,
  faGear,
  faHome,
  faPhone,
  faShare,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useTheme } from "../Context/ThemeContext";

const SideNav = () => {
  const [mode, setMode] = useState("light");
  const [notifications, setNotifications] = useState(3); // Example: 3 unread notifications
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const savedMode = localStorage.getItem("mode") || "light";
    setMode(savedMode);
    document.body.classList.toggle("dark", savedMode === "dark");
  }, []);



  return (
    <nav className={`nav ${theme}`}>
      <div className="menu-items">
        <ul className="nav-links">
          <li>
            <Link href="/dashboard">
              <FontAwesomeIcon className="uil uil-estate nav-icons" icon={faHome} />
              <span className={`link-name ${theme}`}>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/airtime">
              <FontAwesomeIcon
                className="uil uil-files-landscapes nav-icons"
                icon={faPhone}
              />
              <span className={`link-name ${theme}`}>Airtime</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/data">
              <FontAwesomeIcon
                className="uil uil-chart nav-icons"
                icon={faChartArea}
              />
              <span className={`link-name ${theme}`}>Data</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/subscription">
              <FontAwesomeIcon
                className="uil uil-thumbs-up nav-icons"
                icon={faThumbsUp}
              />
              <span className={`link-name ${theme}`}>Subscription</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/pay_bills">
              <FontAwesomeIcon
                className="uil uil-comments nav-icons"
                icon={faComment}
              />
              <span className={`link-name ${theme}`}>Pay Bills</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/transactions">
              <FontAwesomeIcon className="uil uil-share nav-icons" icon={faShare} />
              <span className={`link-name ${theme}`}>Transaction</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/settings">
              <FontAwesomeIcon className="uil uil-gear nav-icons" icon={faGear} />
              <span className={`link-name ${theme}`}>Settings</span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/notifications">
              <FontAwesomeIcon className="uil uil-bell nav-icons" icon={faBell} />
              <span className={`link-name ${theme}`}>Notifications</span>
              {/* {notifications > 0 && <span className="notification-count">{notifications}</span>} */}
            </Link>
          </li>
        </ul>

        <ul className="logout-mode">
          <li>
            <Link href="/">
              <i className="uil uil-signout"></i>
              <span className={`link-name ${theme}`}>Logout</span>
            </Link>
          </li>

          <li className="mode">
            <Link href="#" onClick={toggleTheme}>
              <i className="uil uil-moon"></i>
              {theme == "dark" ? (
                <span className={`link-name ${theme}`}>Dark Mode</span>
              ) : (
                <span className={`link-name ${theme}`}>Light Mode</span>
              )}
              {/* <span className={`link-name ${theme}`}>Dark Mode</span> */}
            </Link>
            <div className={`mode-toggle ${theme}`} onClick={toggleTheme}>
              <span className="switch"></span>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SideNav;
