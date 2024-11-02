'use client';
import React, { useState } from "react";

function SingleTransaction({date,time,description,payment,amount,balance,status}:any) {
// console.log(status == 'Failed');

let className;

// Check the status and set the className accordingly
if (status == 'Pending') {
  className = 'badge text-bg-pending';
//   console.log(className);
  
} else if (status == 'Success') {
    className = 'badge text-bg-success';
    // console.log(className);
}  else {
    // Default class if none of the conditions match
    // console.log(className);
    className = 'badge text-bg-failed';
  
}
    
  return (
    <>
      
        <td scope="row">{date}</td>

        <td scope="row">{time}</td>

        <td scope="row">{description}</td>

        <td scope="row">{payment}</td>

        <td className="text-danger" scope="row">
          <span className="me-1">{amount}</span>
         
        </td>

        <td scope="row">{balance}</td>

        <td scope="row">
          <span className= {className}>{status}</span>
        </td>
  
    </>
  );
}

export default SingleTransaction;
