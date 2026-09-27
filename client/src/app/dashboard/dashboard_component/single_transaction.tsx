'use client';
import React from "react";

function SingleTransaction({ date, time, description, payment, amount, balance, status }: any) {
  const statusText = String(status ?? "");
  let className = "badge text-bg-pending";
  if (statusText === "Completed" || statusText === "Success") className = "badge text-bg-success";
  else if (statusText === "Failed") className = "badge text-bg-failed";

  const isCredit = String(amount ?? "").trim().startsWith("+");

  return (
    <>
      <td scope="row">{date}</td>
      <td scope="row">{time}</td>
      <td scope="row" className="tx-desc">{description}</td>
      <td scope="row">{payment}</td>
      <td scope="row" className={isCredit ? "tx-credit" : "text-danger"}>
        <span className="me-1">{amount}</span>
      </td>
      <td scope="row">{balance}</td>
      <td scope="row">
        <span className={className}>{status}</span>
      </td>
    </>
  );
}

export default SingleTransaction;
