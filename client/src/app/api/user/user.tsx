// import React from 'react'

// function page() {
//   return (
//     <div>page</div>
//   )
// }

// export default page



export default function handler(req:any, res:any) {
    res.status(200).json({ name: 'John Doe' })
  }