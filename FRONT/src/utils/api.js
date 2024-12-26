import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/vlans'; // URL de votre backend

export const getVlans = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des VLANs:', error);
    return [];
  }
};

export const addVlan = async (vlan) => {
  try {
    console.log('Envoi des données au backend :', vlan); // Log des données envoyées
    const response = await axios.post(API_BASE_URL, vlan);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du VLAN :', error);
    throw error;
  }
};

export const updateVlan = async (vlan) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${vlan._id}`, vlan);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du VLAN:', error);
  }
};

export const deleteVlan = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du VLAN:', error);
  }
};
