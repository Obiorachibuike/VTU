import React from 'react';
import '../styles/call.css';

function Call() {
  return (
    <div className="col-lg-5 col-12">
      <div className="custom-block-contact call my-4">
        <h6 className="mb-4">Still can&rsquo;t find what you&rsquo;re looking for?</h6>

        <p>
          <strong>Call us:</strong>
          <a href="tel:3052409671" className="ms-2">
            (60) 305-240-9671
          </a>
        </p>

        <a href="#chat" className="btn custom-btn custom-btn-bg-white mt-3">
          Chat with us
        </a>
      </div>
    </div>
  );
}

export default Call;