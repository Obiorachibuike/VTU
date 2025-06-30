import React from 'react';

interface UpdateNotificationProps {
  notification: string;
}

function UpdateNotification({ notification }: UpdateNotificationProps) {
  return (
    <div
      className={notification}
      id="notification-tab-pane"
      role="tabpanel"
      aria-labelledby="notification-tab"
      tabIndex={0}
    >
      <h6 className="mb-4">Notification</h6>

      <form
        className="custom-form notification-form"
        action="#"
        method="post"
        role="form"
      >
        <div className="form-check form-switch d-flex mb-3 ps-0">
          <label
            className="form-check-label"
            htmlFor="flexSwitchCheckCheckedOne"
          >
            Account activity
          </label>

          <input
            className="form-check-input ms-auto"
            type="checkbox"
            name="form-check-input"
            role="switch"
            id="flexSwitchCheckCheckedOne"
          />
        </div>

        <div className="form-check form-switch d-flex mb-3 ps-0">
          <label
            className="form-check-label"
            htmlFor="flexSwitchCheckCheckedTwo"
          >
            Payment updated
          </label>

          <input
            className="form-check-input ms-auto"
            type="checkbox"
            name="form-check-input"
            role="switch"
            id="flexSwitchCheckCheckedTwo"
          />
        </div>

        <div className="d-flex mt-4">
          <button type="button" className="form-control me-3">
            Reset
          </button>

          <button type="submit" className="form-control ms-2">
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateNotification;