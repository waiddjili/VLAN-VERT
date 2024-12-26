import React, { useState, useEffect } from 'react';
import VlanForm from './VlanForm';
import VlanList from './VlanList';
import { addVlan, updateVlan, deleteVlan, getVlans } from '../utils/api';

function VlanManager() {
  const [vlans, setVlans] = useState([]);
  const [editingVlan, setEditingVlan] = useState(null);

  useEffect(() => {
    fetchVlans();
  }, []);

  const fetchVlans = async () => {
    const fetchedVlans = await getVlans();
    setVlans(fetchedVlans);
  };

  const handleAddVlan = async (vlan) => {
    await addVlan(vlan);
    fetchVlans();
  };

  const handleUpdateVlan = async (vlan) => {
    console.log('VLAN à mettre à jour :', vlan); 
    await updateVlan(vlan);
    setEditingVlan(null);
    fetchVlans();
  };

  const handleDeleteVlan = async (id) => {
    console.log('ID à supprimer :', id);
    await deleteVlan(id);
    fetchVlans();
  };

  const handleEditVlan = (vlan) => {
    setEditingVlan(vlan);
  };

  return (
    <div>
      <VlanForm onSubmit={editingVlan ? handleUpdateVlan : handleAddVlan} initialVlan={editingVlan} />
      <VlanList vlans={vlans} onEdit={handleEditVlan} onDelete={handleDeleteVlan} />
    </div>
  );
}

export default VlanManager;