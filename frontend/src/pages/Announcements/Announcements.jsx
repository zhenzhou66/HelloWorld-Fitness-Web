import React, { useState } from "react";
import styles from "./Announcements.module.css";
import Pagination from "../../components/Pagination/Pagination";
import {Trash, Edit, X } from "lucide-react";

const Announcements = () => {
  // Demonstration Data
  const announcements = [
    {notiid: "UID001", 
    title: "Class Schedule Update",
    message: "The Zumba class on Friday has been rescheduled to 5:00 PM.",
    type: "Announcement",
    publishDate: "2025-01-14 10:00:00"
    },
    {notiid: "UID002", 
      title: "Membership Renewal Reminder",
      message: "Your membership is set to expire soon. Renew now t...",
      type: "Reminder",
      publishDate: "2025-01-10 08:00:00"
    }
];

// Bottom Page Function
  const [currentPage, setCurrentPage] = useState(1);

  const announcementsPerPage = 9;
  const totalPages = Math.ceil(announcements.length / announcementsPerPage);
  const startIndex = (currentPage - 1) * announcementsPerPage;
  const endIndex = startIndex + announcementsPerPage;
  const currentAnnouncements = announcements.slice(startIndex, endIndex);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

// For Add Announcements Overlay
  const [isModalOpen, setIsModalOpen] = useState(false);

  // General Overlay
  const [announcementType, setAnnouncementType] = useState(null);

  return (
    <div className={styles.announcementsContent}>
      <div className={styles.announcementsFunction}>
        <h3 className={styles.announcementsTitle}>
          All Announcement&nbsp;&nbsp;
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
                <button className={styles.editButton}>
                  <Edit size={20} />
                </button>
                <button className={styles.deleteButton}>
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
                      <textarea placeholder="Message of the announcement"></textarea>
                    </div>

                    <div className={styles.schedule}>
                      <label>Schedule for announcement</label>
                      <input type="date" name="dob" />

                      <label>Ends</label>
                      <input type="time" defaultValue="08:00" />
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
                  <button className={styles.updateBtn}>Update</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Announcements;
