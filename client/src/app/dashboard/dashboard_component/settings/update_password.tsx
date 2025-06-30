import React, { useState } from 'react';

interface Props {
  password: string;
}

function UpdatePassword({ password }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errors: string[] = [];

    if (!currentPassword.trim() || currentPassword.length < 8) {
      errors.push("Current password must be at least 8 characters long.");
    }
    if (!newPassword.trim() || newPassword.length < 8) {
      errors.push("New password must be at least 8 characters long.");
    }
    if (!confirmPassword.trim() || confirmPassword.length < 8) {
      errors.push("Confirm password must be at least 8 characters long.");
    }
    if (newPassword !== confirmPassword) {
      errors.push("Passwords do not match.");
    }

    return errors;
  };

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validate();

    if (errors.length > 0) {
      setError(errors.join(" "));
      setSuccess(false);
    } else {
      setError(null);
      setSuccess(true);
      // Submit the form or make API call here
    }
  };

  return (
    <div
      className={password}
      id="password-tab-pane"
      role="tabpanel"
      aria-labelledby="password-tab"
      tabIndex={0}
    >
      <h6 className="mb-4">Password</h6>

      <form className="custom-form password-form" action="#" method="post">
        {error && <div className="error text-danger mb-3">{error}</div>}
        {success && <div className="success text-success mb-3">Update successful!</div>}

        <input
          type="password"
          name="current_password"
          id="current_password"
          className="form-control"
          placeholder="Current Password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <input
          type="password"
          name="new_password"
          id="new_password"
          className="form-control"
          placeholder="New Password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          name="confirm_password"
          id="confirm_password"
          className="form-control"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="d-flex mt-3">
          <button type="reset" className="form-control me-3">
            Reset
          </button>
          <button type="submit" className="form-control ms-2" onClick={handleClick}>
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdatePassword;