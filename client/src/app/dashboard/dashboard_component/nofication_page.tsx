import React from 'react'
import Notification from './notification'
import '../styles/nofication.css'

function NoficationPage() {
  return (
    <>
        <div className="note-cont">
        <div className="note">
         <Notification
              title="Lorem Ipsum"
              message="Quae dolorem earum veritatis oditseno"
              time="30 min. ago"
            />
            </div>
        <div className="note">
             <Notification
              title="Lorem Ipsum"
              message="Quae dolorem earum veritatis oditseno"
              time="30 min. ago"
              />
              </div>
              <div className="note">
             <Notification
              title="Lorem Ipsum"
              message="Quae dolorem earum veritatis oditseno"
              time="30 min. ago"
              />
              </div>
              <div className="note">
             <Notification
              title="Lorem Ipsum"
              message="Quae dolorem earum veritatis oditseno"
              time="30 min. ago"
              />
              </div>
              </div>
    </>
  )
}

export default NoficationPage