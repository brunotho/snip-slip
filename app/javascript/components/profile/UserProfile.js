import React, { useMemo, useState } from 'react';
import Modal from '../shared/Modal';
import ConstrainedLayout from '../shared/ConstrainedLayout';

const UserProfile = ({ initialUser = {}, languages = [] }) => {
  // UI State
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);
  
  // Form State
  const [user, setUser] = useState(initialUser);
  const [formValues, setFormValues] = useState({ name: initialUser.name || '', language: initialUser.language || '' });
  const [passwordValues, setPasswordValues] = useState({ password: '', password_confirmation: '', current_password: '' });
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [isToastHiding, setIsToastHiding] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordValues((prev) => ({ ...prev, [name]: value }));
  };

  const isPasswordDirty = useMemo(() => {
    return Boolean(passwordValues.password || passwordValues.password_confirmation || passwordValues.current_password);
  }, [passwordValues]);

  const isDirty = useMemo(() => {
    return (
      formValues.name !== (user.name || '') ||
      formValues.language !== (user.language || '') ||
      isPasswordDirty
    );
  }, [formValues, user, isPasswordDirty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObject = {};
    formData.forEach((value, key) => {
      if ((key === "password" || key === "password_confirmation" || key === 'current_password') && !value) {
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
        setErrors({});
        setPasswordValues({ password: '', password_confirmation: '', current_password: '' });
        setIsPasswordSectionOpen(false);

        setShowToast(true);
        setIsToastHiding(false);
        setTimeout(() => setIsToastHiding(true), 2700);
        setTimeout(() => setShowToast(false), 3000);
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
      <div className="form-container">
        <h2>Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-inputs">
            <input
              type="text"
              id="name"
              name="name"
              value={formValues.name}
              onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))}
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
            value={formValues.language}
            onChange={(e) => setFormValues((prev) => ({ ...prev, language: e.target.value }))}
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

          <div className="d-flex align-items-center mb-3">
            <button
              type="button"
              className="btn btn-neutral btn-subtle-shadow"
              onClick={() => setIsPasswordSectionOpen(!isPasswordSectionOpen)}
            >
              {isPasswordSectionOpen ? 'Hide password fields' : 'Change password'}
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

              <input
                type="password"
                id="current_password"
                name="current_password"
                className="form-control"
                placeholder="Current Password"
                onChange={handlePasswordChange}
                required
                autoComplete="current-password"
              />
              <div style={{ height: '0.5rem' }} />
            </>
          )}

          <div className="d-flex justify-content-end mt-4">
            <button type="submit" className="btn btn-accent btn-profile-equal" disabled={!isDirty}>Save changes</button>
          </div>

          <div className="d-flex justify-content-end" style={{ marginTop: '1rem' }}>
            <DeleteAccountSection userId={user.id} />
          </div>
        </div>
      </form>
    </div>
    {showToast && (
      <div className={`toast-notice ${isToastHiding ? 'is-hiding' : ''}`}>Profile updated</div>
    )}
    </ConstrainedLayout>
  );
};

function DeleteAccountSection({ userId }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const canDelete = confirmText === 'DELETE';

  const onDelete = async () => {
    try {
      const token = document.querySelector('[name="csrf-token"]').content;
      const response = await fetch(`/api/users/me`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': token },
      });
      if (!response.ok) throw new Error('Failed to delete account');
      window.location.href = '/';
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <button className="btn btn-danger-outline btn-profile-equal" onClick={() => setIsConfirmOpen(true)}>
        Delete account
      </button>
      <Modal isOpen={isConfirmOpen} onClose={() => { setIsConfirmOpen(false); setConfirmText(''); }}>
        <div className="modal-frame modal-frame--compact">
          <div className="modal-content-scroll modal-content--compact">
            <div className="modal-hint">Type DELETE to delete your account. This cannot be undone.</div>
            <input
              type="text"
              placeholder=""
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="form-control modal-input-compact"
            />
          </div>
          <div className="modal-footer-sticky modal-button-group modal-button-group--center modal-footer--compact">
            <button className="btn btn-neutral" onClick={() => { setIsConfirmOpen(false); setConfirmText(''); }}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={onDelete} disabled={!canDelete}>
              Confirm delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default UserProfile;
