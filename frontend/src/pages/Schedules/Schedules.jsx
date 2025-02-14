import React, { useState } from "react";
import styles from "./Schedules.module.css";
import { Trash, Edit, X } from "lucide-react";

const Schedules = () => {
  // Static data for demonstration
  const classes = [
    {
      class_id: "1",
      class_name: "Yoga Flow",
      description: "A relaxing yoga session focused on flexibility and...",
      class_image: "https://via.placeholder.com/50",
      schedule_date: "2025-01-20",
      start_time: "08:00 AM",
      end_time: "09:00 AM",
    },
    {
      class_id: "2",
      class_name: "HIIT Workout",
      description: "High-intensity interval training",
      class_image: "https://via.placeholder.com/50",
      schedule_date: "2025-02-16",
      start_time: "5:00 PM",
      end_time: "6:00 PM",
    }
  ];

  const user = [
    {
      profile_picture: "https://via.placeholder.com/50",
      name: "Ali",
    },
    {
      profile_picture: "https://via.placeholder.com/50",
      name: "John",
    }
  ];

  const [formData, setFormData] = useState({
    className: '',
    classImage: null,
    description: '',
    scheduleDate: '',
    startTime: '',
    endTime: '',
    maxParticipants: '',
    trainerName: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    closeModal();
  };

  // Bottom Page Function
  const [currentPage, setCurrentPage] = useState(1);
  const schedulesPerPage = 5;

  const totalPages = Math.ceil(classes.length / schedulesPerPage);
  const startIndex = (currentPage - 1) * schedulesPerPage;
  const endIndex = startIndex + schedulesPerPage;
  const currentSchedules = classes.slice(startIndex, endIndex);

  // Add Class Modal Function
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.schedulesContent}>
      <div className={styles.schedulesFunction}>
        <h3 className={styles.schedulesTitle}>All Classes</h3>
        <div className={styles.schedulesAction}>
          <div className={styles.searchContainer}>
            <input type="text" className={styles.searchInput} placeholder="Search" />
          </div>
          <button className={styles.addClass} onClick={openModal}>Add Class</button>
        </div>
      </div>

      <table className={styles.schedulesTable}>
        <thead>
          <tr>
            <th className={styles.checkboxclassid}>
              <div className={styles.checkboxContainer}>
                <input type="checkbox" />
                <span>Class ID</span>
              </div>
            </th>
            <th>Class Name</th>
            <th>Schedule Date</th>
            <th>Time</th>
            <th>Assigned Trainer</th>
            <th>Current Participants</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentSchedules.map((classes) => (
            <tr key={classes.class_id}>
              <td className={styles.checkboxclassid}>
                <div className={styles.checkboxContainer}>
                  <input type="checkbox" />
                  <span>{classes.class_id}</span>
                </div>
              </td>
              <td>
                <div className={styles.classdetailsContainer}>
                  <img src={classes.class_image} alt="Class Image" className={styles.classImage} />
                  <div className={styles.classDetails}>
                    <span className={styles.className}>{classes.class_name}</span>
                    <span className={styles.classDescription}>{classes.description}</span>
                  </div>
                </div>
              </td>
              <td className={styles.scheduleDate}>{classes.schedule_date}</td>
              <td>
                <span className={styles.classStartTime}>{classes.start_time}</span>
                <span className={styles.dash}>-</span>
                <span className={styles.classEndTime}>{classes.end_time}</span>
              </td>
              <td>
                <div className={styles.assignedTrainerContainer}>
                  <img src={user.profile_picture} alt="Trainer Profile Picture" className={styles.trainerImage} />
                  <span className={styles.trainerName}>{user.name}</span>
                </div>
              </td>
              <td>
                <span className={styles.classParticipants}>10 / 20</span>
              </td>
              <td>
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
      
      {/* Bottom Page Function */}
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index + 1} className={currentPage === index + 1 ? styles.active : ""} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>

      {/* Add Class Overlay Function */}
      {isModalOpen && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.textstyle}>Add New Class</span>
              <X className={styles.XButton} onClick={closeModal} />
            </div>

            <form onSubmit={handleSubmit} className={styles.formContainer}>
              <div className={styles.classHeader}>
                <label className={styles.classNameTextStyle}>Class Name:</label>
                <input type="text" name="className" value={formData.className} onChange={handleChange} required />
              </div>

              <div className={styles.imageUpload} onClick={() => document.getElementById('classImageInput').click()}>
                {FormData.classImage ? (
                  <img src={URL.createObjectURL(formData.classImage)} alt="Class" className={styles.uploadedImage} />
                ) : (
                  <span className={styles.uploadPlaceholder}>+</span>
                )}
                <input type="file" id="classImageInput" name="classImage" style={{ display: 'none' }} onChange={(e) => setFormData({ ...formData, classImage: e.target.files[0] })} />
              </div>

              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required />

              <div className={styles.dateTimeContainer}>
                <div>
                  <label>Date:</label>
                  <input type="date" name="scheduleDate" value={formData.scheduleDate} onChange={handleChange} required />
                </div>
              </div>

              <div>
                <label>Start time:</label>
                <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
              </div>

              <div>
                <label>End time:</label>
                <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
              </div>

              <div className={styles.participantTrainerContainer}>
                <div>
                  <label>Max Participants:</label>
                  <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} min="1" required />
                </div>

                <div>
                  <label>Assigned Trainer:</label>
                  <select name="trainerName" value={formData.trainerName} onChange={handleChange} required>
                    <option value="">Select trainer</option>
                    <option value="Trainer A">Trainer A</option>
                    <option value="Trainer B">Trainer B</option>
                  </select>
                </div>
              </div>
              
              <button type="submit" className={styles.confirmButton}>Add Class</button>
            </form>
          </div>
        </div>
      )}
    </div>
)}

export default Schedules;