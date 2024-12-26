import React from 'react';

function VlanList({ vlans, onEdit, onDelete }) {
  return (
    <table className="vlan-list">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>VLAN ID</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {vlans.map((vlan) => (
          <tr key={vlan._id}>
            <td>{vlan._id}</td>
            <td>{vlan.name}</td>
            <td>{vlan.vlanId}</td>
            <td>
              <button onClick={() => onEdit(vlan)}>Edit</button>
              <button onClick={() => onDelete(vlan._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default VlanList;