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
          <button className={styles.addAnnouncement}>Add Announcement</button>
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
    </div>
  )
}

export default Announcements;
