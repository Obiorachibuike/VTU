import React, { useState } from 'react'

function UpdatePassword({password}:any) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);
  
  const validate = () => {
    const errors:any = [];
  
    if (!currentPassword.trim() || currentPassword.length < 8) {
        errors.push("Password must be at least 8 characters long");
        console.log(errors);
      }
    if (!newPassword.trim() || newPassword.length < 8) {
        errors.push("Password must be at least 8 characters long");
        console.log(errors);
      }
    if (!confirmPassword.trim() || confirmPassword.length < 8) {
        errors.push("Password must be at least 8 characters long");
        console.log(errors);
      }
      if (newPassword !== confirmPassword) {
        errors.push("Password are not the same");
        console.log(errors);
        
      }
      return errors
  }
  
  
  
    const handleClick = (e:any) => {
        e.preventDefault()
        // if (currentPassword = password) {
        //     alert("Incorrect Password!!!, Please input the current Password")
        // }
      const errors:any = validate()
      console.log(errors);
      
      if (errors) {
        setError("Please fill in all fields correctly.");
        setError (errors)
        setSuccess(false)
        
      } else {
        setSuccess(true)
    }
    // if (errors.length) {
    //     setErrorMessage(errors.join(", "));
        
    //     return;
    // } else {
    //       setSuccess(true)
        
    //   }
    }

  return (
    <>
        <div
                className={password}
                id="password-tab-pane"
                role="tabpanel"
                aria-labelledby="password-tab"
                tabIndex={0}
              >
                <h6 className="mb-4">Password</h6>

                <form
                  className="custom-form password-form"
                  action="#"
                  method="post"
                  role="form"
                >
                       {error && <div className="error">{error}</div>}
                {success && <div className="success">Update successful!</div>}
                  <input
                    type="password"
                    name="current_password"
                    id="current_password"
                    pattern="[0-9a-zA-Z]{4,10}"
                    className="form-control"
                    placeholder="Current Password"
                    required
                    value={currentPassword}
                    onChange={(e) => {setCurrentPassword(e.target.value)}}
                  />

                  <input
                    type="password"
                    name="new_password"
                    id="new_password"
                    pattern="[0-9a-zA-Z]{4,10}"
                    className="form-control"
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => {setNewPassword(e.target.value)}}
                  />

                  <input
                    type="password"
                    name="confirm_password"
                    id="confirm_password"
                    pattern="[0-9a-zA-Z]{4,10}"
                    className="form-control"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {setConfirmPassword(e.target.value)}}
                  />

                  <div className="d-flex">
                    <button type="reset" className="form-control me-3">
                      Reset
                    </button>
                    <input type="reset" hidden/>

                    <button type="submit" className="form-control ms-2" onClick={handleClick}>
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
    </>
  )
}

export default UpdatePassword