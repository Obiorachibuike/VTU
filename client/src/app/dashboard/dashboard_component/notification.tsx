import React from 'react'

function Notification({title,message,time}:any) {
  return (
    <>
     <li className="notification-item">
              <i className="bi bi-exclamation-circle text-warning"></i>
              <div>
                <h4>{title}</h4>
                <p>{message}</p>
                <p>{time}</p>
              </div>
            </li>
            </>
  )
}

export default Notification