import React, { useState, useEffect } from "react";
import styles from "./Memberships.module.css";
import { Trash, Edit, X } from "lucide-react";

export default function Memberships() {
  const [search, setSearch] = useState("");
  const [memberships, setMemberships] = useState({ membershipDetails: [], membershipCount: 0 });
  const [filteredMemberships, setFilteredMemberships] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [newMembership, setNewMembership] = useState({
    plan_name: "",
    description: "",
    price: "",
  });
  const [editMembership, setEditMembership] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [membershipToDelete, setMembershipToDelete] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/memberships/display")
      .then((response) => response.json())
      .then((data) => {
        setMemberships(data);
        setFilteredMemberships(data.membershipDetails);
      })
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

  const filterMemberships = (searchQuery) => {
    const filtered = memberships.membershipDetails.filter((plan) =>
      plan.plan_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMemberships(filtered);
  };

  useEffect(() => {
    filterMemberships(search);
  }, [search, memberships.membershipDetails]);

  const toggleModal = (membership = null) => {
    if (membership) {
      setEditMembership(membership);
    } else {
      setEditMembership(null); 
      setNewMembership({ plan_name: "", description: "", price: "" });
    }
    setIsModalOpen(!isModalOpen);
  };
  
  const handleInputChange = (e) => {
    if (editMembership) {
      setEditMembership({ ...editMembership, [e.target.name]: e.target.value });
    } else {
      setNewMembership({ ...newMembership, [e.target.name]: e.target.value });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editMembership
      ? `http://localhost:5000/api/memberships/edit/${editMembership.membership_id}`
      : 'http://localhost:5000/api/memberships/add';
    const method = editMembership ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editMembership || newMembership),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(editMembership ? 'Membership updated successfully' : 'Membership added successfully');
        fetchMemberships();
        toggleModal();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchMemberships = () => {
    fetch("http://localhost:5000/api/memberships/display")
      .then((response) => response.json())
      .then((data) => {
        setMemberships(data);
        setFilteredMemberships(data.membershipDetails);
      })
      .catch((error) => console.error("Error fetching stats:", error));
  };

  const handleDeleteClick = (membership) => {
    setMembershipToDelete(membership);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    fetch(`http://localhost:5000/api/memberships/delete/${membershipToDelete.membership_id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Membership deleted successfully');
        fetchMemberships();
        setIsDeleteModalOpen(false);
      })
      .catch((error) => {
        console.error(error);
        setIsDeleteModalOpen(false);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.subtitle}>
          All Membership Plan&nbsp;&nbsp;
          <span className={styles.membershipCount}>({memberships.membershipCount})</span>
        </p>
        <input 
          type="text" 
          placeholder="Search" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className={styles.searchInput} 
        />
        <button className={styles.addButton} onClick={() => toggleModal()}>+ Membership</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Membership ID</th>
            <th>Plan Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMemberships.map((plan) => (
            <tr key={plan.membership_id}>
              <td>{plan.membership_id}</td>
              <td>{plan.plan_name}</td>
              <td>{plan.description}</td>
              <td>${plan.price}</td>
              <td className={styles.actions}>
                <Edit
                  className={styles.icon}
                  size={20}
                  onClick={() => toggleModal(plan)}
                />
                <Trash
                  className={styles.icon}
                  size={20}
                  onClick={() => handleDeleteClick(plan)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>            
            <button className={styles.closeButton} onClick={toggleModal}>
              <X size={24} />
            </button>
            <h2>{editMembership ? 'Edit' : 'Add'} Membership Plan</h2>
            <form onSubmit={handleSubmit}>
              <label>Plan Name:</label>
              <input type="text" name="plan_name" placeholder="Exp. Standard Monthly Plan" value={editMembership ? editMembership.plan_name : newMembership.plan_name} onChange={handleInputChange} required />
              
              <label>Description:</label>
              <textarea name="description" rows="8" placeholder="Enter description..." value={editMembership ? editMembership.description : newMembership.description} onChange={handleInputChange} required />

              <label>Price:</label>
              <input type="number" name="price" placeholder="Exp. 100" value={editMembership ? editMembership.price : newMembership.price} onChange={handleInputChange} required />

              <div className={styles.buttonSection}>
                <button type="button" className={styles.cancelButton} onClick={toggleModal}>Cancel</button>
                <button type="submit" className={styles.submitButton}>{editMembership ? 'Update' : 'Add'} Membership</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ textAlign: "center" }}>
            <button className={styles.closeButton} onClick={() => setIsDeleteModalOpen(false)}>
              <X size={24} />
            </button>
            <Trash className={styles.deleteIcon} size={40}/>
            <p style={{ marginBottom: "30px" }}>Are you sure you want to delete this membership plan?</p>
            <div className={styles.buttonSection}>
              <button className={styles.cancelButton} onClick={() => setIsDeleteModalOpen(false)}>
                No, cancel
              </button>
              <button className={styles.submitButton} onClick={handleDelete}>
                Yes, I'm sure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
