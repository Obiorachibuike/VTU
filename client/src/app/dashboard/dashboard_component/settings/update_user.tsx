"use client";
import React, { useState, useRef } from "react";

function UpdateUser({ profile }: any) {
  const [image, setImage] = useState("/image/profile.jpg");
  const [img, setImg] = useState("/image/profile.jpg");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const fileInputRef = useRef(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errors: string[] = [];

    if (!name.trim()) {
      errors.push("Name is required");
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      errors.push("Invalid email format");
    }

    return errors;
  };

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    // Submit logic here
    alert("Profile updated successfully!");
  };

  return (
    <div
      className={profile}
      id="profile-tab-pane"
      role="tabpanel"
      aria-labelledby="profile-tab"
      tabIndex={0}
    >
      <h6 className="mb-4">User Profile</h6>

      <form
        className="custom-form profile-form"
        action="#"
        method="post"
        role="form"
      >
        <input
          className="form-control"
          type="text"
          name="profile-name"
          id="profile-name"
          placeholder="John Doe"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="form-control"
          type="email"
          name="profile-email"
          id="profile-email"
          placeholder="Johndoe@gmail.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="input-group mb-1">
          <div className="profile_image_cont">
            <img
              src={image}
              className="profile-image img-fluid"
              width={50}
              height={50}
              alt="Profile"
            />
          </div>

          <input
            type="file"
            className="form-control"
            id="inputGroupFile02"
            onChange={handleImageUpload}
            required
          />
        </div>

        <div className="d-flex">
          <button type="button" className="form-control me-3">
            Reset
          </button>

          <button
            type="submit"
            className="form-control ms-2"
            onClick={handleClick}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateUser;