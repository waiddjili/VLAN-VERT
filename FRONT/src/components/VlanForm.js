import React, { useState, useEffect } from 'react';

function VlanForm({ onSubmit, initialVlan }) {
  const [vlan, setVlan] = useState({ _id: 0, name: '', vlanId: 0 });

  useEffect(() => {
    if (initialVlan) {
      setVlan(initialVlan);
    } else {
      setVlan({ _id: 0, name: '', vlanId: 0 });
    }
  }, [initialVlan]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(vlan);
    setVlan({ _id: 0, name: '', vlanId: 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="vlan-form">
      <div>
        <label htmlFor="name">VLAN Name</label>
        <input
          type="text"
          id="name"
          value={vlan.name}
          onChange={(e) => setVlan({ ...vlan, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label htmlFor="vlanId">VLAN ID</label>
        <input
          type="number"
          id="vlanId"
          value={vlan.vlanId}
          onChange={(e) => setVlan({ ...vlan, vlanId: parseInt(e.target.value) })}
          required
          min="1"
          max="4094"
        />
      </div>
      <button type="submit">
        {initialVlan ? 'Update VLAN' : 'Add VLAN'}
      </button>
    </form>
  );
}

export default VlanForm;