import React, { useState } from 'react';
import ConstrainedLayout from './ConstrainedLayout';

export default function UserProfile({ initialUser = {}, languages = [] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(initialUser);
  const [errors, setErrors] = useState({});
  const [changingSensitiveInfo, setChangingSensitiveInfo] = useState(false);

  const handleSensitiveInfoChange = (e) => {
    const { name, value } = e.target;
    if (name === "password" || name === "password_confirmation") {
      setChangingSensitiveInfo(!!value);
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
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <ConstrainedLayout>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="border p-4 rounded">
          <h3 className="mb-3">Edit Profile</h3>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={user.name}
              className="form-control"
            />
            {errors.name && <div className="text-danger">{errors.name.join(", ")}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="language" className="form-label">Language</label>
            <select
              id="language"
              name="language"
              defaultValue={user.language}
              className="form-select"
            >
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
            {errors.language && <div className="text-danger">{errors.language.join(", ")}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">New Password (optional)</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              onChange={handleSensitiveInfoChange}
            />
            {errors.password && <div className="text-danger">{errors.password.join(", ")}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password_confirmation" className="form-label">Confirm New Password</label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              className="form-control"
              onChange={handleSensitiveInfoChange}
            />
          </div>

          {changingSensitiveInfo && (
            <div className="mb-3">
              <label htmlFor="current_password" className="form-label">Current Password</label>
              <input
                type="password"
                id="current_password"
                name="current_password"
                className="form-control"
                required
              />
              {errors.current_password && (
                <div className="text-danger">{errors.current_password.join(", ")}</div>
              )}
            </div>
          )}

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="border p-4 rounded">
          <h3 className="mb-3">{user.name}</h3>
          <p><strong>Language:</strong> {user.language}</p>
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      )}
    </ConstrainedLayout>
  );
}
