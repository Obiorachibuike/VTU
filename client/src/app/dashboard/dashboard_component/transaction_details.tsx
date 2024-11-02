'use client'
import React, { useState } from "react";
import "../styles/transaction_details.css";
import Link from "next/link";
import SingleTransaction from "./single_transaction";

function TransactionDetails() {

  const transactions = [
    { date: "July 5, 2023", time: "10:00 PM", description: "Shopping", payment: "C2C Transfer", amount: "- $100.00", balance: "$5,500.00", status: "Pending" },
    { date: "July 2, 2023", time: "10:42 AM", description: "Food Delivery", payment: "Mobile Reload", amount: "+ $250.00", balance: "$5,600.00", status: "Success" },
    { date: "July 28, 2023", time: "8:20 PM", description: "Billing", payment: "Government", amount: "+ $50.00", balance: "$5,350.00", status: "Success" },
    { date: "July 24, 2023", time: "10:48 PM", description: "Shopping", payment: "QR Code", amount: "- $380.00", balance: "$5,300.00", status: "Failed" },
    { date: "July 12, 2023", time: "12:30 PM", description: "Food Delivery", payment: "Mobile Reload", amount: "+ $250.00", balance: "$4,920.00", status: "Success" },
    { date: "May 31, 2023", time: "2:40 PM", description: "Food Delivery", payment: "Mobile Reload", amount: "+ $50.00", balance: "$4,920.00", status: "Success" },
    { date: "May 22, 2023", time: "8:50 PM", description: "Food Delivery", payment: "Mobile Reload", amount: "+ $50.00", balance: "$4,920.00", status: "Success" },
    { date: "May 20, 2023", time: "6:45 PM", description: "Food Delivery", payment: "Mobile Reload", amount: "- $500.00", balance: "$4,920.00", status: "Pending" },
    { date: "April 28, 2023", time: "11:20 PM", description: "Food Delivery", payment: "Mobile Reload", amount: "- $856.00", balance: "$4,920.00", status: "Success" },
    { date: "April 16, 2023", time: "11:00 PM", description: "Food Delivery", payment: "Mobile Reload", amount: "+ $50.00", balance: "$4,920.00", status: "Pending" },
  ];

  const pageSize = 5; // number of transactions per page
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(transactions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };



  return (
    <div>
      <section className="transaction-section">
        <div className="activity">
          <Link href={"/dashboard/transactions"}>
            <div className="title">
              <i className="uil uil-clock-three"></i>
              <span className="text">Transaction</span>
            </div>
          </Link>

          <div className="main-wrapper col-md-9 ms-sm-auto py-4 col-lg-9 px-md-4 border-start">
            

            <div className="row my-4">
              <div className="col-lg-12 col-12">
                <div className="custom-block bg-white">
                  <h5 className="mb-4">Account Activities</h5>

                  <div className="table-responsive">
                    <table className="account-table table">
                      <thead>
                        <tr>
                          <th scope="col">Date</th>

                          <th scope="col">Time</th>

                          <th scope="col">Description</th>

                          <th scope="col">Payment Type</th>

                          <th scope="col">Amount</th>

                          <th scope="col">Balance</th>

                          <th scope="col">Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {paginatedTransactions.map((b,index) =>(
                          <tr  key={index}>
                               <SingleTransaction
                            date={b.date}
                            time={b.time}
                            description={b.description}
                            payment={b.payment}
                            amount={b.amount}
                            balance={b.balance}
                            status={b.status}
                          />
                          </tr>
                        ))}
                         
                        

                      


                      </tbody>
                    </table>
                  </div>
<div className="pagination">

                  {Array(totalPages)
            .fill(0)
            .map((_, index) => (
              <li
              key={index}
              className={`page-item ${index + 1 === currentPage ? "active" : ""}`}
              >
                <div
                  className="page-link"
                 
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </div>
              </li>
            ))}
            </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TransactionDetails;
