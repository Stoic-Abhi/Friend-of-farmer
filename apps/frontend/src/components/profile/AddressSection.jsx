/**
 * src/components/profile/AddressSection.jsx
 *
 * Address fields + GeolocationButton.
 * Controlled component — all state lives in parent.
 */

import GeolocationButton from './GeolocationButton.jsx';

export default function AddressSection({ address, onChange, onGeoLocation, loading }) {
  function handleField(field, value) {
    onChange({ ...address, [field]: value });
  }

  return (
    <div className="address-section">
      <GeolocationButton
        onLocation={(loc) => {
          onChange({
            ...address,
            district: loc.district || address.district,
            state:    loc.state || address.state,
          });
          onGeoLocation?.(loc);
        }}
        disabled={loading}
      />

      <div className="address-fields">
        <div className="pf-field">
          <label htmlFor="addr-line">Address Line</label>
          <input
            id="addr-line"
            type="text"
            className="pf-input"
            placeholder="House/flat no., street name"
            value={address.addressLine ?? ''}
            onChange={e => handleField('addressLine', e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="pf-field">
          <label htmlFor="addr-landmark">Landmark</label>
          <input
            id="addr-landmark"
            type="text"
            className="pf-input"
            placeholder="Near temple, bus stop, etc."
            value={address.landmark ?? ''}
            onChange={e => handleField('landmark', e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="pf-row">
          <div className="pf-field">
            <label htmlFor="addr-district">District</label>
            <input
              id="addr-district"
              type="text"
              className="pf-input"
              placeholder="e.g. Tumkur"
              value={address.district ?? ''}
              onChange={e => handleField('district', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="pf-field">
            <label htmlFor="addr-state">State</label>
            <input
              id="addr-state"
              type="text"
              className="pf-input"
              placeholder="e.g. Karnataka"
              value={address.state ?? ''}
              onChange={e => handleField('state', e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="pf-field pf-narrow">
          <label htmlFor="addr-pincode">Pincode</label>
          <input
            id="addr-pincode"
            type="text"
            className="pf-input"
            placeholder="560001"
            value={address.pincode ?? ''}
            onChange={e => handleField('pincode', e.target.value)}
            disabled={loading}
            maxLength={6}
          />
        </div>
      </div>
    </div>
  );
}
