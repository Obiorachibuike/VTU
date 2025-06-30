import React from 'react';
import Notification from './notification';
import '../styles/nofication.css';

function NoficationPage() {
  // Optionally, use an array to render multiple notifications
  const notifications = [
    {
      title: "Lorem Ipsum",
      message: "Quae dolorem earum veritatis oditseno",
      time: "30 min. ago",
    },
    {
      title: "Lorem Ipsum",
      message: "Quae dolorem earum veritatis oditseno",
      time: "30 min. ago",
    },
    {
      title: "Lorem Ipsum",
      message: "Quae dolorem earum veritatis oditseno",
      time: "30 min. ago",
    },
    {
      title: "Lorem Ipsum",
      message: "Quae dolorem earum veritatis oditseno",
      time: "30 min. ago",
    },
  ];

  return (
    <div className="note-cont">
      {notifications.map((note, index) => (
        <div className="note" key={index}>
          <Notification
            title={note.title}
            message={note.message}
            time={note.time}
          />
        </div>
      ))}
    </div>
  );
}

export default NoficationPage;