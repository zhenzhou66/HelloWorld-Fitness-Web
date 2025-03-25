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
  const [membershipToDelete, setMembershipToDelete] = useState([]);

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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const url = editMembership
      ? `http://localhost:5000/api/memberships/edit/${editMembership.membership_id}`
      : 'http://localhost:5000/api/memberships/add';
  
    const method = editMembership ? 'PUT' : 'POST';
    const bodyData = JSON.stringify(editMembership || newMembership);
  
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: bodyData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
  
      alert(editMembership ? 'Membership updated successfully' : 'Membership added successfully');
      fetchMemberships();
      toggleModal();
    } catch (error) {
      alert(error.message);
      console.error('Error:', error);
    }
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

  const handleDeleteClick = (membership_id = null) => {
      let selectedMembershipIds;
  
      if (membership_id) {
        selectedMembershipIds = [membership_id];
      } else {
        selectedMembershipIds = Object.keys(selectedMembership).filter(id => selectedMembership[id]);
          
          if (selectedMembershipIds.length === 0) {
              alert("Please select at least one member to delete.");
              return;
          }
      }
      setMembershipToDelete(selectedMembershipIds);
      setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
      fetch(`http://localhost:5000/api/memberships/delete`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ membership_ids: membershipToDelete }),
      })
      .then(response => response.json())
      .then(data => {
          alert(data.message);
          fetchMemberships(); 
          setSelectedMembership({});
          setSelectAll(false);
          setIsDeleteModalOpen(false);
          setMembershipToDelete([]);
      })
      .catch(error => {
          console.error("Error deleting members:", error);
      });
  }; 

  // Bottom Page Function
  const [currentPage, setCurrentPage] = useState(1);
  const membershipPerPage = 9;

  const totalPages = Math.ceil(memberships.membershipCount / membershipPerPage);
  const startIndex = (currentPage - 1) * membershipPerPage;
  const endIndex = startIndex + membershipPerPage;
  const currentMembers = filteredMemberships.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
  }
  
  // For Select All Function
  const [SelectAll, setSelectAll] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState({});

  const handleSelectAll = (event) => {
      const isChecked = event.target.checked;
      setSelectAll(isChecked);
  
      const updatedMembership = {};
      filteredMemberships.forEach(membership => {
          updatedMembership[membership.membership_id] = isChecked;
      });
  
      setSelectedMembership(updatedMembership);
  };

  const handleSelectMembership = (event, membership_id) => {
      const isChecked = event.target.checked;
  
      setSelectedMembership((prev) => {
          const updatedMembership = { ...prev, [membership_id]: isChecked };
  
          const allSelected = Object.values(updatedMembership).every((val) => val === true);
          setSelectAll(allSelected);
  
          return updatedMembership;
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>
          All Membership Plan&nbsp;&nbsp;
          <span className={styles.membershipCount}>({memberships.membershipCount})</span>
        </h3>
        <div className={styles.membershipActions}>
          <input 
            type="text" 
            placeholder="Search" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className={styles.searchInput} 
          />
          <button className={styles.addButton} onClick={() => toggleModal()}>Add Membership</button>
          <button className={styles.deleteButton} onClick={() => handleDeleteClick(null)}>Delete Selected</button>
          
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkboxuserid}>
              <div className={styles.checkboxContainer}>
                <input type="checkbox" checked={SelectAll} onChange={handleSelectAll} /> 
                 <span>Membership ID</span>
              </div>
            </th>
            <th>Plan Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMemberships.map((plan) => (
            <tr key={plan.membership_id}>
              <td className={styles.checkboxuserid}>
                <div className={styles.checkboxContainer}>
                  <input type="checkbox" checked={selectedMembership[plan.membership_id] || false} onChange={(e) => handleSelectMembership(e, plan.membership_id)}/>
                  <span>{plan.membership_id}</span>
                </div>
              </td>
              <td>{plan.plan_name}</td>
              <td>{plan.description}</td>
              <td>${plan.price}</td>
              <td >
                <div className={styles.actions}>
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
                </div>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
            <button
                key={index + 1} 
                className={currentPage === index + 1 ? styles.active : ""}
                onClick={() => handlePageChange(index + 1)}
            >
                {index + 1}
            </button>
        ))}
      </div>

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

              <label>Duration (months):</label>
              <input type="number" name="duration" placeholder="Exp. 1-12" value={editMembership ? editMembership.duration : newMembership.duration} onChange={handleInputChange} required/>

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
