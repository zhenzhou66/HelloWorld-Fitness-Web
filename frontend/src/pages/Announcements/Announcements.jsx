import React, { useState, useEffect } from "react";
import styles from "./Announcements.module.css";
import Pagination from "../../components/Pagination/Pagination";
import {Trash, Edit, X } from "lucide-react";
import ConfirmModal from "../../components/ConfirmDelete/ConfirmDelete";

const Announcements = () => {
  const [announcement, setAnnouncement] = useState({ announcementDetails: [], announcementCount: 0 });
  const [filteredAnnouncement, setFilteredAnnouncement] = useState([]); 

  // Fetch billing data from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/announcement/display")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        setAnnouncement(data); 
        setFilteredAnnouncement(data.announcementDetails);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  // Formatting date function
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { timeZone: "Asia/Kuala_Lumpur" });
  }

  // Searching function
  const [search, setSearch] = useState("");

  useEffect(() => {
      if (search.trim() === "") {
          setFilteredAnnouncement(announcement.announcementDetails); 
      } else {
        setFilteredAnnouncement(
          announcement.announcementDetails.filter((notification) => 
            notification.title.toLowerCase().includes(search.toLowerCase()))
          );
      }
  }, [search, announcement.announcementDetails]);

  // Bottom Page Function
  const [currentPage, setCurrentPage] = useState(1);

  const announcementsPerPage = 9;
  const totalPages = Math.ceil(announcement.announcementCount / announcementsPerPage);
  const startIndex = (currentPage - 1) * announcementsPerPage;
  const endIndex = startIndex + announcementsPerPage;
  const currentAnnouncements = filteredAnnouncement.slice(startIndex, endIndex);

  // For Select All Function
  const [SelectAll, setSelectAll] = useState(false);
  const [selectedAnnouncements, setSelectedAnnouncements] = useState({});

  const handleSelectAll = (event) => {
      const isChecked = event.target.checked;
      setSelectAll(isChecked);
  
      const updatedAnnouncement = {};
      currentAnnouncements.forEach(announcement => {
        updatedAnnouncement[announcement.notification_id] = isChecked;
      });
  
      setSelectedAnnouncements(updatedAnnouncement);
  };

  const handleSelectAnnouncement = (event, notification_id) => {
      const isChecked = event.target.checked;
  
      setSelectedAnnouncements((prev) => {
          const updatedAnnouncement = { ...prev, [notification_id]: isChecked };
  
          const allSelected = Object.values(updatedAnnouncement).every((val) => val === true);
          setSelectAll(allSelected);
  
          return updatedAnnouncement;
      });
  };

  // For Delete Announcement
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState([]);

  const handleDeleteClick = (notification_id = null) => {
      let selectedIds;
  
      if (notification_id) {
        selectedIds = [notification_id];
      } else {
        selectedIds = Object.keys(selectedAnnouncements).filter(id => selectedAnnouncements[id]);
          
          if (selectedIds.length === 0) {
              alert("Please select at least one member to delete.");
              return;
          }
      }
      setAnnouncementToDelete(selectedIds);
      setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
      fetch(`http://localhost:5000/api/announcement/delete`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notification_ids: announcementToDelete }),
      })
      .then(response => response.json())
      .then(data => {
          alert(data.message);
          fetchAnnouncement(); 
          setSelectedAnnouncements({});
          setSelectAll(false);
          setShowDeleteConfirm(false);
          setAnnouncementToDelete([]);
      })
      .catch(error => {
          console.error("Error deleting announcement:", error);
      });
  };    

  const fetchAnnouncement = () => {
    fetch("http://localhost:5000/api/announcement/display")
      .then((response) => response.json())
      .then((data) => {
        setAnnouncement(data); 
        setFilteredAnnouncement(data.announcementDetails);
      })
      .catch((error) => console.error("Error fetching stats:", error));
  };

  // For Add Announcements Overlay
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcementType, setAnnouncementType] = useState(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      title: "", 
      message: "", 
      type: "", 
      send_date: "",
      end_date: "",
      target: "", 
      user_id: "", 
      class_id: ""
    });
  };

  const [formData, setFormData] = useState({ 
      title: "", 
      message: "", 
      type: "", 
      send_date: "",
      end_date: "",
      target: "", 
      user_id: "", 
      class_id: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = 'http://localhost:5000/api/announcement/add';

    const formDataToSend = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        send_date: formData.send_date,
        end_date: formData.end_date,
        user_id: formData.user_id,
        class_id: formData.class_id,
        target: announcementType,
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
    })
    .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "An error occurred while adding announcement.");
        }

        alert(data.message); 
        fetchAnnouncement();
        closeModal();
    })
    .catch((error) => {
        alert(error.message); 
        console.error(error);
    });
  };

// For Edit Overlay
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const openEditModal = (announcements) => {
    setSelectedAnnouncement(announcements);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAnnouncement(null);
  };

  const handleSave = (e) => {
      e.preventDefault()

      fetch(`http://localhost:5000/api/announcement/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedAnnouncement),
      })
      .then(response => response.json())
      .then(data => {
          alert(data.message); 
          closeEditModal();
          fetchAnnouncement(); 
      })
      .catch(error => {
          alert(error.message); 
          console.error("Error updating announcement:", error);
      });
  };

  return (
    <div className={styles.announcementsContent}>
      <div className={styles.announcementsFunction}>
        <h3 className={styles.announcementsTitle}>
          All Announcement&nbsp;&nbsp;
          <span className={styles.transactionCount}>({announcement.announcementCount})</span>
        </h3>
        <div className={styles.announcementAction}>
          <div className={styles.searchContainer}>
            <input type="text" className={styles.searchInput} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
          </div>
          <button className={styles.addAnnouncement} onClick={() => setIsModalOpen(true)}>Add Announcement</button>
          <button className={styles.deleteMemberButton} onClick={() => handleDeleteClick(null)}>Delete Selected</button>
        </div>
      </div>
        
      <table className={styles.announcementsTable}>
        <thead>
          <tr>
            <th className={styles.checkboxAid}>
              <div className={styles.checkboxContainer}>
                <input type="checkbox" checked={SelectAll} onChange={handleSelectAll}/>
                <span>Notification ID</span>
              </div>
            </th>
            <th>Title</th>
            <th>Message</th>
            <th>Type</th>
            <th>Publish Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentAnnouncements.map((announcements) => (
            <tr key={announcements.notification_id}>
              <td className={styles.checkboxAid}>
                <div className={styles.checkboxContainer}>
                  <input type="checkbox" checked={selectedAnnouncements[announcements.notification_id] || false} onChange={(e) => handleSelectAnnouncement(e, announcements.notification_id)}/>
                  {announcements.notification_id}
                </div>
              </td>
              <td className={styles.aTitle}>{announcements.title}</td>
              <td className={styles.aMessage}>{announcements.message}</td>
              <td className={styles.aType}>{announcements.type}</td>
              <td className={styles.aPublishDate}>{formatDate(announcements.send_date)}</td>
              <td className={styles.actions}>
                <button className={styles.editButton} onClick={() => openEditModal(announcements)}>
                  <Edit size={20} />
                </button>
                <button className={styles.deleteButton} onClick={() => handleDeleteClick(announcements.notification_id)}>
                  <Trash size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Add Announcements Overlay */}
      {isModalOpen && (
        <div className={styles.addAOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
              <X size={24} />
            </button>
            {!announcementType ? (
              // Step 1: Show Announcement Selection Buttons
              <>
                <h2 className={styles.modalTitle}>Add Announcement</h2>
                <div className={styles.modalButtons}>
                  <button 
                    className={styles.announcementBtn} 
                    onClick={() => setAnnouncementType("General")}
                  >
                    General Announcement
                  </button>
                  <button 
                    className={styles.announcementBtn} 
                    onClick={() => setAnnouncementType("Member")}
                  >
                    Member Announcement
                  </button>
                  <button 
                    className={styles.announcementBtn}
                    onClick={() => setAnnouncementType("Trainer")}
                  >
                    Trainer Announcement
                  </button>
                </div>
              </>
            ) : (
              // Step 2: Show the Selected Announcement Form
              <>
                <form onSubmit={handleSubmit}>
                  <h2 className={styles.modalTitle}>
                    <span className={styles.icon}>🔔</span> {announcementType === "General" ? "Add General Announcement" : announcementType === "Member" ? "Add Member Announcement" : "Add Trainer Announcement"}
                  </h2>
                  <div className={styles.announcementForm}>
                    <div className={styles.leftColumn}>
                      <div className={styles.inputGroup}>
                        <label>Title</label>
                        <input type="text" placeholder="Title of the announcement" name="title" value={formData.title} onChange={handleChange} required/>
                      </div>

                      <div className={styles.inputGroup}>
                        <label>Message</label>
                        <textarea placeholder="Message of the announcement" name="message" value={formData.message} onChange={handleChange} required />
                      </div>

                      <div className={styles.schedule}>
                        <label>Schedule for announcement</label>
                        <input type="date" name="send_date" value={formData.send_date} onChange={handleChange} required />

                        <label>Ends</label>
                        <input type="date" name="end_date" value={formData.end_date} onChange={handleChange}/>
                      </div>
                    </div>

                    <div className={styles.rightColumn}>
                      <div className={styles.notificationType}>
                        <label>Type of notification</label>
                        <div className={styles.radioGroup}>
                          <input type="radio" id="Announcement" name="type" value="Announcement" checked={formData.type === "Announcement"} onChange={handleChange} required/>
                          <label htmlFor="Announcement">Announcement</label>
                          <input type="radio" id="Reminder" name="type" value="Reminder" checked={formData.type === "Reminder"} onChange={handleChange} required/>
                          <label htmlFor="Reminder">Reminder</label>
                        </div>
                      </div>

                      <div className={styles.schedule}>
                        <label>User ID</label>
                        <input type="number" name="user_id" value={formData.user_id} onChange={handleChange}/>

                        <label>Class ID</label>
                        <input type="number" name="class_id" value={formData.class_id} onChange={handleChange}/>
                      </div>
                    </div>
                  </div>

                  <div className={styles.modalActions}>
                    <button className={styles.cancelBtn} onClick={() => setAnnouncementType(null)}>
                      Back
                    </button>
                    <input type="submit" className={styles.updateBtn} value="Publish" />
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className={styles.Editoverlay}>
          <div className={styles.modal}>
            <h2>Edit Announcement</h2>
            <button className={styles.closeBtn} onClick={() => setIsEditModalOpen(false)}>
              <X size={24} />
            </button>
            <form onSubmit={handleSave}>
              <div className={styles.announcementForm}>
                <div className={styles.leftColumn}>
                  <div className={styles.inputGroup}>
                    <label>Title</label>
                    <input type="text" name="title" value={selectedAnnouncement?.title || ""} onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, title: e.target.value })} required/>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Message</label>
                    <textarea name="message" value={selectedAnnouncement?.message || ""} onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, message: e.target.value })} required/>
                  </div>

                  <div className={styles.schedule}>
                    <label>Schedule for announcement</label>
                    <input type="date" name="send_date" value={new Date(selectedAnnouncement?.send_date || "").toLocaleDateString('en-CA')} onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, send_date: e.target.value })} required />

                    <label>Ends</label>
                    <input type="date" name="end_date" value={new Date(selectedAnnouncement?.end_date || "").toLocaleDateString('en-CA')} onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, end_date: e.target.value })}/>
                  </div>
                </div>
                <div className={styles.rightColumn}>
                  <div className={styles.notificationType}>
                    <label>Type of notification</label>
                    <div className={styles.radioGroup}>
                    <input type="radio" name="type" value="Announcement" checked={selectedAnnouncement?.type === "Announcement"} onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, type: e.target.value })} required/>
                    <label htmlFor="Announcement">Announcement</label>

                    <input type="radio" name="type" value="Reminder" checked={selectedAnnouncement?.type === "Reminder"} onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, type: e.target.value })} required/>
                    <label htmlFor="Reminder">Reminder</label>
                    </div>
                  </div>

                  <div className={styles.schedule}>
                    <label>User ID</label>
                    <input type="number" name="user_id" value={selectedAnnouncement?.user_id || ""} onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, user_id: e.target.value })}/>

                    <label>Class ID</label>
                    <input type="number" name="class_id" value={selectedAnnouncement?.class_id || ""} onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, class_id: e.target.value })}/>
                  </div>
                </div>
              </div>
              <div className={styles.modalActions}>
                <button className={styles.cancelBtn} onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <input type="submit" className={styles.updateBtn} value="Update"/>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* For Admin to Delete Schedule(Overlay) */}
      {showDeleteConfirm && (
        <div className={styles.modalOverlayDeleteM}>
            <div className={styles.modalDeleteM} style={{ textAlign: "center" }}>
                <button className={styles.closeButton} onClick={() => setShowDeleteConfirm(false)}>
                <X size={24} />
                </button>
                <Trash className={styles.deleteIcon} size={40}/>
                <p style={{ marginBottom: "30px" }}>Are you sure you want to delete this announcement?</p>
                <div className={styles.modalButtons}>
                    <button className={styles.cancelDeleteButton} onClick={() => setShowDeleteConfirm(false)}>
                        No, cancel
                    </button>
                    <button className={styles.confirmDeleteButton} onClick={handleDelete}>
                        Yes, I'm sure
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default Announcements;
