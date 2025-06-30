import React from 'react';

interface NotificationProps {
  title: string;
  message: string;
  time: string;
}

const Notification: React.FC<NotificationProps> = ({ title, message, time }) => {
  return (
    <li className="notification-item">
      <i className="bi bi-exclamation-circle text-warning"></i>
      <div>
        <h4>{title}</h4>
        <p>{message}</p>
        <p>{time}</p>
      </div>
    </li>
  );
};

export default Notification;