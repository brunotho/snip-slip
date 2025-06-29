import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';

const UserProfile = ({ initialUser = {}, languages = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);
  const [user, setUser] = useState(initialUser);
  const [errors, setErrors] = useState({});
  const [changingSensitiveInfo, setChangingSensitiveInfo] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if ((name === "password" || name === "password_confirmation") && value){
      setChangingSensitiveInfo(true);
    } else if (!value) {
      setChangingSensitiveInfo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = {};
    formData.forEach((value, key) => {
      if ((key === "password" || key === "password_confirmation") && !value) {
        return;
      }
      formObject[key] = value;
    });

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          user: formObject,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditing(false);
        setErrors({});
        setChangingSensitiveInfo(false);
        setIsPasswordSectionOpen(false);
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  if (!isEditing) {
    return (
      <div className="container form-container" style={{ margin: "6rem auto 2rem auto" }}>
        <h2>{user.name}</h2>
        <div className="card-body-custom">
          <p>Snippet Settings:</p>
          <p>Language: {user.language}</p>
        </div>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-accent"
            onClick={() => setIsEditing(true)}
            >
            Edit Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container form-container" style={{ margin: "6rem auto 2rem auto" }}>
      <h2>Edit your profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-inputs">
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={user.name}
            className="form-control"
            placeholder="Name"
            autoComplete="name"
          />
          {errors.name && (
            <div className="invalid-feedback d-block">
              {errors.name.join(", ")}
            </div>
          )}

          <select
            id="language"
            name="language"
            defaultValue={user.language}
            className="form-control"
            autoComplete="language"
          >
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
          {errors.language && (
            <div className="invalid-feedback d-block">
              {errors.language.join(", ")}
            </div>
          )}

          <div className="d-flex align-items-center mb-2">
            <p className="mb-0">Change Password</p>
            <button
              type="button"
              className="btn-plusminus ms-2"
              onClick={() => setIsPasswordSectionOpen(!isPasswordSectionOpen)}
            >
              <FontAwesomeIcon icon={isPasswordSectionOpen ? faMinus : faPlus} />
            </button>
          </div>

          {isPasswordSectionOpen && (
            <>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="New Password"
                onChange={handlePasswordChange}
                autoComplete="new-password"
              />
              {errors.password && (
                <div className="invalid-feedback d-block">
                  {errors.password.join(", ")}
                </div>
              )}

              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                className="form-control"
                placeholder="Confirm New Password"
                onChange={handlePasswordChange}
                autoComplete="new-password"
              />

              {changingSensitiveInfo && (
                <input
                  type="password"
                  id="current_password"
                  name="current_password"
                  className="form-control"
                  placeholder="Current Password"
                  required
                  autoComplete="current-password"
                />
              )}
            </>
          )}

          <div className="form-actions d-flex justify-content-between mt-4">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => {
                setIsEditing(false);
                setIsPasswordSectionOpen(false);
                setChangingSensitiveInfo(false);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-accent">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
