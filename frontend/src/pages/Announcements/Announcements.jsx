import React, { useState, useEffect } from "react";
import styles from "./Announcements.module.css";
import Pagination from "../../components/Pagination/Pagination";
import {Trash, Edit, X } from "lucide-react";
import ConfirmModal from "../../components/ConfirmDelete/ConfirmDelete";

const Announcements = () => {
  const [announcement, setAnnouncement] = useState({ membersDetails: [], membersCount: 0 });
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
        setFilteredAnnouncement(data.detailResult);
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

// Bottom Page Function
  const [currentPage, setCurrentPage] = useState(1);

  const announcementsPerPage = 9;
  const totalPages = Math.ceil(announcementCount / announcementsPerPage);
  const startIndex = (currentPage - 1) * announcementsPerPage;
  const endIndex = startIndex + announcementsPerPage;
  const currentAnnouncements = announcement.slice(startIndex, endIndex);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

// For Add Announcements Overlay
  const [isModalOpen, setIsModalOpen] = useState(false);

  // General Overlay
  const [announcementType, setAnnouncementType] = useState(null);

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

// For Delete Announcement
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const handleDeleteClick = (notiid) => {
    setSelectedDeleteId(notiid);
    setShowDeleteConfirm(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteConfirm(false);
    setSelectedDeleteId(null);
  };

  return (
    <div className={styles.announcementsContent}>
      <div className={styles.announcementsFunction}>
        <h3 className={styles.announcementsTitle}>
          All Announcement&nbsp;&nbsp;
          <span className={styles.transactionCount}>({announcementCount})</span>
        </h3>
        <div className={styles.announcementAction}>
          <div className={styles.searchContainer}>
            <input type="text" className={styles.searchInput} placeholder="Search" />
          </div>
          <button className={styles.addAnnouncement} onClick={() => setIsModalOpen(true)}>Add Announcement</button>
        </div>
      </div>
        
      <table className={styles.announcementsTable}>
        <thead>
          <tr>
            <th className={styles.checkboxAid}>
              <div className={styles.checkboxContainer}>
                <input type="checkbox" />
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
            <tr key={announcements.notiid}>
              <td className={styles.checkboxAid}>
                <div className={styles.checkboxContainer}>
                  <input type="checkbox" />
                  {announcements.notiid}
                </div>
              </td>
              <td className={styles.aTitle}>{announcements.title}</td>
              <td className={styles.aMessage}>{announcements.message}</td>
              <td className={styles.aType}>{announcements.type}</td>
              <td className={styles.aPublishDate}>{announcements.publishDate}</td>
              <td className={styles.actions}>
                <button className={styles.editButton} onClick={() => openEditModal(announcements)}>
                  <Edit size={20} />
                </button>
                <button className={styles.deleteButton} onClick={() => handleDeleteClick(announcements.notiid)}>
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
                    onClick={() => setAnnouncementType("general")}
                  >
                    General Announcement
                  </button>
                  <button 
                    className={styles.announcementBtn}
                    onClick={() => setAnnouncementType("coach")}
                  >
                    Coach Announcement
                  </button>
                </div>
              </>
            ) : (
              // Step 2: Show the Selected Announcement Form
              <>
                <h2 className={styles.modalTitle}>
                  <span className={styles.icon}>🔔</span> {announcementType === "general" ? "Add General Announcement" : "Add Coach Announcement"}
                </h2>
                <div className={styles.announcementForm}>
                  <div className={styles.leftColumn}>
                    <div className={styles.inputGroup}>
                      <label>Title</label>
                      <input type="text" placeholder="Title of the announcement" />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Message</label>
                      <textarea placeholder="Message of the announcement" />
                    </div>

                    <div className={styles.schedule}>
                      <label>Schedule for announcement</label>
                      <input type="date" name="dob" />

                      <label>Ends</label>
                      <input type="time" />
                    </div>
                  </div>

                  <div className={styles.rightColumn}>
                    <div className={styles.notificationType}>
                      <label>Type of notification</label>
                      <div className={styles.radioGroup}>
                        <input type="radio" id="announcement" name="type" checked />
                        <label htmlFor="announcement">Announcement</label>
                        <input type="radio" id="reminder" name="type" />
                        <label htmlFor="reminder">Reminder</label>
                      </div>
                    </div>

                    <div className={styles.posterUpload}>
                      <label>Poster <span className={styles.optional}>*not required</span></label>
                      <input type="file" />
                    </div>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button className={styles.cancelBtn} onClick={() => setAnnouncementType(null)}>
                    Cancel
                  </button>
                  <button className={styles.updateBtn}>Publish</button>
                </div>
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
                  <input type="date" name="scheduleDate" value={selectedAnnouncement?.scheduleDate || ""} onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, scheduleDate: e.target.value })} required />

                  <label>Ends</label>
                  <input type="time" name="endTime" value={selectedAnnouncement?.endTime || ""} onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, endTime: e.target.value })} required />
                </div>
              </div>
              <div className={styles.rightColumn}>
                <div className={styles.notificationType}>
                  <label>Type of notification</label>
                  <div className={styles.radioGroup}>
                    <input type="radio" name="type" value="type" checked={selectedAnnouncement?.type || ""} onChange={(e) => setSelectedAnnouncement({ ...selectedAnnouncement, type: e.target.value })} />
                    <label htmlFor="announcement">Announcement</label>
                    <input type="radio" id="reminder" name="type" />
                    <label htmlFor="reminder">Reminder</label>
                  </div>
                </div>

                <div className={styles.posterUpload}>
                  <label>Poster <span className={styles.optional}>*not required</span></label>
                  <input type="file" />
                </div>
              </div>
            </div>
              <div className={styles.modalActions}>
                  <button className={styles.cancelBtn} onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </button>
                  <button className={styles.updateBtn}>Update</button>
              </div>
          </div>
        </div>
      )}

      {/* For Admin to Delete Schedule(Overlay) */}
      <ConfirmModal
        show={showDeleteConfirm}
        onClose={closeDeleteModal}
        onConfirm={() => {
          closeDeleteModal(); // Just close the modal (no backend delete)
        }}
        message="Are you sure you want to delete this announcement?"
        confirmText="Yes, delete it"
        cancelText="No, cancel"
      />
    </div>
  )
}

export default Announcements;
