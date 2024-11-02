"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";

function UpdateUser({ profile }: any) {
  const [image, setImage] = useState("/image/profile.jpg ");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(reader.result);

        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [img, setImg] = useState("/image/profile.jpg");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const fileInputRef = useRef(null);

  const validate = () => {
    const errors: any = [];

    if (!img.trim()) {
      return errors.push("Name is required");
    }
    if (!name.trim()) {
      return errors.push("Name is required");
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      return errors.push("Invalid email format");
    }
  };

  // const triggerFileInput = () => {
  //   fileInputRef.current.click();
  // };
  const loadFile = (e: any) => {
    const file = e.target.files[0];
    const read = file.FileReader;
    console.log(read);

    const { name } = file;
    // console.log(file.name);
    if (!file) {
      ("User hasn't selected any file");
    }
    // setImg(read);
  };

  const handleClick = () => {
    validate();
  };

  return (
    <>
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
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <input
            className="form-control"
            type="email"
            name="profile-email"
            id="profile-email"
            placeholder="Johndoe@gmail.com"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <div className="input-group mb-1">
            <div className="profile_image_cont" >
              <img
                src={image}
                className="profile-image img-fluid"
                width={50}
                height={50}
                alt=""
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
    </>
  );
}

export default UpdateUser;
