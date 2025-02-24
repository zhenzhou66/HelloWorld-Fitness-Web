import React, { useState } from "react";
import styles from "./Schedules.module.css";
import { Trash, Edit, X, Eye } from "lucide-react";
import ConfirmModal from "../../components/ConfirmDelete/ConfirmDelete.jsx";

const Schedules = () => {
  const [selectedClass, setSelectedClass] = useState(null);

  const handleRowClick = (event, classes) => {
    if (event.target.closest(`.${styles.actions}`)) {
      return;
    }
    handleViewClick(classes);
  };

  const closeOverlay = () => {
    setSelectedClass(null); // Close the overlay
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [scheduleInfo, setScheduleInfo] = useState({
    className: "",
    scheduleDate: "",
    startTime: "",
    endTime: "",
    trainerName: "",
    description: ""
});

  const openEditModal = (schedule) => {
    setScheduleInfo(schedule);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setScheduleInfo({
        className: "",
        scheduleDate: "",
        startTime: "",
        endTime: "",
        trainerName: "",
        description: ""
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setScheduleInfo((prevState) => ({ ...prevState, [name]: value }));
  };

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

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
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

  // View Class Modal Function
  const handleViewClick = (classes) => {
    setSelectedClass(classes);
  }

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
            <tr key={classes.class_id} onClick={(event) => handleRowClick(event, classes)} className={styles.clickableRow}>
              <td className={styles.checkboxclassid}>
                <div className={styles.checkboxContainer}>
                  <input type="checkbox" onClick={(e) => e.stopPropagation()} />
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
              <td className={styles.actions} onClick={(e) => e.stopPropagation()}>
                <button className={styles.viewButton} onClick={() => handleViewClick(classes)}>
                  <Eye size={20} />
                </button>
                <button className={styles.editButton} onClick={() => 
                openEditModal(classes)}>
                  <Edit size={20} />
                </button>
                <button className={styles.deleteButton} onClick={() => setShowDeleteConfirm(true)}>
                  <Trash size={20} />
                </button>

                {showDeleteConfirm && <ConfirmModal
                  show={showDeleteConfirm}
                  onClose={() => setShowDeleteConfirm(false)}
                  onConfirm={() => {}}
                  message="Are you sure you want to delete this transaction?"
                  confirmText="Yes, I'm sure"
                  cancelText="No, cancel"
                  />
                }
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
                <label>Class Name:</label>
                <input type="text" name="className" value={formData.className} onChange={handleChange} placeholder="Class Name" required />
              </div>

              <div className={styles.uploadDescriptionContainer}>
                <div className={styles.imageUpload} onClick={() => document.getElementById('classImageInput').click()}>
                  {formData.classImage ? (
                    <img src={URL.createObjectURL(formData.classImage)} alt="Class" className={styles.uploadedImage} />
                  ) : (
                    <span className={styles.uploadPlaceholder}>+</span>
                  )}
                  <input type="file" id="classImageInput" name="classImage" style={{ display: 'none' }} onChange={(e) => setFormData({ ...formData, classImage: e.target.files[0] })} />
                </div>
              

                <div className={styles.descriptionContainer}>
                  <label>Description:</label>
                  <textarea className={styles.descriptionInput} name="description" placeholder="Brief description of the class" value={formData.description} onChange={handleChange} required />
                </div>
              </div>

              <div className={styles.dateTimeContainer}>
                <div>
                  <label>Date:</label>
                  <input type="date" name="scheduleDate" value={formData.scheduleDate} onChange={handleChange} required />
                </div>
                <div>
                  <label>Start time:</label>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
                </div>
                <div>
                  <label>End time:</label>
                  <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
                </div>
              </div>

              <div className={styles.participantTrainerContainer}>
                <div>
                  <label>Max Participants:</label>
                  <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} min="1" required />
                </div>

                <div>
                  <label>Assigned Trainer:</label>
                  <select name="trainerName" value={formData.trainerName} onChange={handleChange} required>
                    <option value="" disabled>Select trainer</option>
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

      {/* Edit Overlay */}
      {isEditModalOpen && (
        <div className={styles.editOverlay} onClick={closeEditModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.textstyle}>Edit Class</span>
              <X className={styles.closeButton} onClick={closeEditModal} />
            </div>
                        
            <form className={styles.formContainer}>
              <div className={styles.classHeader}>
                <label>Class Name:</label>
                <input type="text" name="className" value={scheduleInfo.className} onChange={handleEditChange} required />
              </div>
                            
              <div className={styles.descriptionContainer}>
                <label>Description:</label>
                <textarea name="description" value={scheduleInfo.description} onChange={handleEditChange} required />
              </div>
                            
              <div className={styles.dateTimeContainer}>
                <div>
                  <label>Date:</label>
                  <input type="date" name="scheduleDate" value={scheduleInfo.scheduleDate} onChange={handleEditChange} required />
                </div>
                <div>
                  <label>Start Time:</label>
                  <input type="time" name="startTime" value={scheduleInfo.startTime} onChange={handleEditChange} required />
                </div>
                <div>
                  <label>End Time:</label>
                  <input type="time" name="endTime" value={scheduleInfo.endTime} onChange={handleEditChange} required />
                </div>
              </div>
              
              <div className={styles.participantTrainerContainer}>
                <div>
                <label>Assigned Trainer:</label>
                  <select name="trainerName" value={formData.trainerName} onChange={handleChange} required>
                    <option value="" disabled>Select trainer</option>
                    <option value="Trainer A">Trainer A</option>
                    <option value="Trainer B">Trainer B</option>
                  </select>
                </div>
              </div>
                            
              <div className={styles.buttonSection}>
                <button type="button" onClick={closeEditModal} className={styles.cancelDeleteButton}>Cancel</button>
                <button type="submit" className={styles.confirmDeleteButton}>Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Overlay */}
      {selectedClass && (
        <div className={styles.overlay} onClick={closeOverlay}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span>View Class</span>
              <button className={styles.closeButton} onClick={closeOverlay}>✖</button>
            </div>

            <div className={styles.classnameid}>
            <span>{selectedClass.class_name}</span>
            <span><strong>ID:</strong> {selectedClass.class_id}</span>
            </div>

            <div className={styles.classInfo}>
              <img src={selectedClass.class_image} alt="Class" className={styles.classImage} />
              <div>
                <label>Description</label>
                <textarea readOnly value={selectedClass.description}></textarea>
              </div>
            </div>

            <div className={styles.dateTime}>
              <div>
                <label>Date</label>
                <input type="text" value={selectedClass.schedule_date} readOnly />
              </div>
              <div>
                <label>Start time</label>
                <input type="text" value={selectedClass.start_time} readOnly />
              </div>
              <div>
                <label>End time</label>
                <input type="text" value={selectedClass.end_time} readOnly />
              </div>
            </div>

            <div className={styles.trainerParticipants}>
              <div>
                <label>Max Participants</label>
                <input type="text" value="20" readOnly />  {/* Hardcoded for now */}
              </div>
              <div>
                <label>Assigned Trainer</label>
                <input type="text" value="Trainer A" readOnly />  {/* Hardcoded for now */}
              </div>
            </div>

            <hr className={styles.edithr} />
            <h4>Participants: {selectedClass.participants?.length || 0}</h4>
            <div className={styles.participantsList}>
              {selectedClass.participants?.map((participant, index) => (
                <div key={index} className={styles.participant}>
                  <img src={participant.avatar} alt={participant.name} />
                  <span>{participant.name}</span>
                </div>
              )) || <p>No Participants</p>}
            </div>
          </div>
        </div>
      )}
    </div>
)}

export default Schedules;