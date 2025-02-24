import React, { useState, useEffect } from "react";
import styles from "./Schedules.module.css";
import { Trash, Edit, X, Eye } from "lucide-react";
import ConfirmModal from "../../components/ConfirmDelete/ConfirmDelete.jsx";

const Schedules = () => {
  const [search, setSearch] = useState("");
  const [classes, setClass] = useState({ classDetails: [], classCount: 0 });
  const [filteredClass, setFilteredClass] = useState([]);
  const [selectedClass, setSelectedClass] = useState(false);

//Display Classes
  useEffect(() => {
    fetch("http://localhost:5000/api/schedules/display")
      .then((response) => response.json())
      .then((data) => {
        setClass(data);
        setFilteredClass(data.classDetails);
      })
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

//Search Classes
  const filterClass = (searchQuery) => {
    const filtered = classes.classDetails.filter((plan) =>
      plan.class_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredClass(filtered);
  };

  useEffect(() => {
    filterClass(search);
  }, [search, classes.classDetails]);
  
// Formatting date function
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' }); 
  }

  const handleRowClick = (event, classes) => {
    if (event.target.closest(`.${styles.actions}`)) {
      return;
    }
    handleViewClick(classes);
  };

  const closeOverlay = () => {
    setSelectedClass(false); // Close the overlay
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

  const totalPages = Math.ceil(classes.classCount / schedulesPerPage);
  const startIndex = (currentPage - 1) * schedulesPerPage;
  const endIndex = startIndex + schedulesPerPage;
  const currentSchedules = filteredClass.slice(startIndex, endIndex);

  // Add Class Modal Function
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // View Class Modal Function
  const [viewClass, setViewClass] = useState([]);
  const [participants, setParticipants] = useState([]);
  const handleViewClick = (class_id) => {
    const selected = currentSchedules.find((classes) => classes.class_id === class_id);
    if (selected) {
      setViewClass(selected);
      fetch(`http://localhost:5000/api/schedules/participants/${class_id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      .then(response => response.json())
      .then(data => {
          setParticipants(data.participants || []);
      })
      .catch(error => {
          console.error("Error fetching participants:", error);
      });
      setSelectedClass(true);
    }
  }

  return (
    <div className={styles.schedulesContent}>
      <div className={styles.schedulesFunction}>
        <h3 className={styles.schedulesTitle}>
          All Classes&nbsp;&nbsp;
          <span className={styles.classCount}>({classes.classCount})</span>
        </h3>
        <div className={styles.schedulesAction}>
          <div className={styles.searchContainer}>
            <input type="text" className={styles.searchInput} placeholder="Search" value={search} 
            onChange={(e) => setSearch(e.target.value)}/>
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
                  <img src={`http://localhost:5000/uploads/${classes.class_image}`} alt="Class Image" className={styles.classImage} />
                  <div className={styles.classDetails}>
                    <span className={styles.className}>{classes.class_name}</span>
                    <span className={styles.classDescription}>{classes.description}</span>
                  </div>
                </div>
              </td>
              <td className={styles.scheduleDate}>{formatDate(classes.schedule_date)}</td>
              <td>
                <span className={styles.classStartTime}>{classes.start_time}</span>
                <span className={styles.dash}>-</span>
                <span className={styles.classEndTime}>{classes.end_time}</span>
              </td>
              <td>
                <div className={styles.assignedTrainerContainer}>
                  <img src={`http://localhost:5000/uploads/${classes.profile_picture}`} alt="Trainer Profile Picture" className={styles.trainerImage} />
                  <span className={styles.trainerName}>{classes.name}</span>
                </div>
              </td>
              <td>
                <span className={styles.classParticipants}>10 / {classes.max_participants}</span>
              </td>
              <td className={styles.actions} onClick={(e) => e.stopPropagation()}>
                <button className={styles.viewButton} onClick={() => handleViewClick(classes.class_id)}>
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
            <span>{viewClass.class_name}</span>
            <span><strong>ID:</strong> {viewClass.class_id}</span>
            </div>

            <div className={styles.classInfo}>
              <img src={`http://localhost:5000/uploads/${viewClass.class_image}`} alt="Class" className={styles.classImage} />
              <div>
                <label>Description:</label>
                <textarea readOnly value={viewClass.description}></textarea>
              </div>
            </div>

            <div className={styles.dateTime}>
              <div>
                <label>Date:</label>
                <input type="text" value={formatDate(viewClass.schedule_date)} readOnly />
              </div>
              <div>
                <label>Start time:</label>
                <input type="text" value={viewClass.start_time} readOnly />
              </div>
              <div>
                <label>End time:</label>
                <input type="text" value={viewClass.end_time} readOnly />
              </div>
            </div>

            <div className={styles.trainerParticipants}>
              <div>
                <label>Max Participants:</label>
                <input type="text" value={viewClass.max_participants} readOnly />  {/* Hardcoded for now */}
              </div>
              <div>
                <label>Assigned Trainer:</label>
                <input type="text" value={viewClass.name} readOnly />  {/* Hardcoded for now */}
              </div>
            </div>

            <hr className={styles.edithr} />
            <h4>Participants: {participants?.length || 0}</h4>
            <div className={styles.participantsList}>
              {participants.length > 0 ? (
                participants.map((participant, index) => (
                  <div key={index} className={styles.assignedTrainerContainer}>
                    <img src={`http://localhost:5000/uploads/${participant.profile_picture}`} 
                        alt={participant.name} className={styles.trainerImage}/>
                    <span className={styles.trainerName}>{participant.name}</span>
                  </div>
                ))
              ) : (
                <p>No Participants</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
)}

export default Schedules;