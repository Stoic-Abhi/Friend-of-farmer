/**
 * src/components/profile/ProfileForm.jsx
 *
 * Shared form for display name + bio. Used in ProfileSetupPage and AccountPage.
 */

import { useState } from 'react';

export default function ProfileForm({ initial = {}, onSave, loading, submitLabel = 'Save' }) {
  const [displayName, setDisplayName] = useState(initial.displayName ?? '');
  const [bio,         setBio]         = useState(initial.bio ?? '');

  function handleSubmit(e) {
    e.preventDefault();
    if (!displayName.trim()) return;
    onSave({ displayName: displayName.trim(), bio: bio.trim() });
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="pf-field">
        <label htmlFor="pf-name">Display Name *</label>
        <input
          id="pf-name"
          type="text"
          className="pf-input"
          placeholder="e.g. Raju Gowda"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          disabled={loading}
          maxLength={60}
          autoFocus
        />
      </div>

      <div className="pf-field">
        <label htmlFor="pf-bio">Bio</label>
        <textarea
          id="pf-bio"
          className="pf-textarea"
          placeholder="Tell people about yourself…"
          value={bio}
          onChange={e => setBio(e.target.value)}
          disabled={loading}
          maxLength={500}
          rows={3}
        />
        <span className="pf-char-count">{bio.length}/500</span>
      </div>

      <button
        type="submit"
        className="pf-submit"
        disabled={loading || !displayName.trim()}
      >
        {loading ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
