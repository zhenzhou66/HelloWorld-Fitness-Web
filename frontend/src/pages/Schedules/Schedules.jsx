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

// View Class Modal Function
  const [viewClass, setViewClass] = useState([]);
  const [participants, setParticipants] = useState([]);

  const closeOverlay = () => {
    setSelectedClass(false); 
  };

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

//Edit Class Function
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [scheduleInfo, setScheduleInfo] = useState([]);

  const openEditModal = (class_id) => {
    setScheduleInfo((prev) => ({
      ...prev, 
      class_id: class_id 
    }));
    const selected = currentSchedules.find((classes) => classes.class_id === class_id);
    setScheduleInfo(selected);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setScheduleInfo([]);
  };

  const handleEditChange = (e) => {
    setScheduleInfo({ ...scheduleInfo, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e, updateClass) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/schedules/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateClass),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); 
        closeEditModal();
        fetchClasses(); 
    })
    .catch(error => {
        alert(error.message); 
        console.error("Error updating class:", error);
    });
  };

// Delete Class Function
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [classesToDelete, setClassesToDelete] = useState([]);

  const handleDeleteClick = (class_id = null) => {
      let selectedClassIds;
  
      if (class_id) {
        selectedClassIds = [class_id];
      } else {
        selectedClassIds = Object.keys(selectedClasses).filter(id => selectedClasses[id]);
          
          if (selectedClassIds.length === 0) {
              alert("Please select at least one class to delete.");
              return;
          }
      }
      setClassesToDelete(selectedClassIds);
      setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
      fetch(`http://localhost:5000/api/schedules/delete`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ class_ids: classesToDelete }),
      })
      .then(response => response.json())
      .then(data => {
          alert(data.message);
          fetchClasses(); 
          setSelectedClasses({});
          setSelectAll(false);
          setShowDeleteConfirm(false);
          setClassesToDelete([]);
      })
      .catch(error => {
          console.error("Error deleting class:", error);
      });
  };    

//Fetch trainers
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
      fetch('http://localhost:5000/api/schedules/trainers')
          .then((response) => response.json())
          .then((data) => {
            setTrainers(data);
          })
          .catch((error) => console.error("Error fetching trainers:", error));
  }, []);

// Add Class Modal Function
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ 
    className: "", 
    description: "", 
    scheduleDate: "", 
    startTime: "",
    endTime: "",
    maxParticipants: "", 
    trainerName: "", 
  });

  const closeModal = () => {
    setIsModalOpen(false)
    setFormData({
      className: "", 
      description: "", 
      scheduleDate: "", 
      startTime: "",
      endTime: "",
      maxParticipants: "", 
      trainerName: "", 
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = 'http://localhost:5000/api/schedules/add';
    const method = 'POST';

    const formDataToSend = new FormData();
    formDataToSend.append("className", formData.className);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("scheduleDate", formData.scheduleDate);
    formDataToSend.append("startTime", formData.startTime);
    formDataToSend.append("endTime", formData.endTime);
    formDataToSend.append("maxParticipants", formData.maxParticipants);
    formDataToSend.append("trainerName", formData.trainerName);
    
    if (formData.classImage) {
        formDataToSend.append("classImage", formData.classImage);
    }

    fetch(url, {
        method,
        body: formDataToSend,
    })
    .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "An error occurred while adding class.");
        }

        alert(data.message); 
        fetchClasses();
        closeModal();
    })
    .catch((error) => {
        alert(error.message); 
        console.error(error);
    });
  };

  const fetchClasses = () => {
    fetch("http://localhost:5000/api/schedules/display")
      .then((response) => response.json())
      .then((data) => {
        setClass(data);
        setFilteredClass(data.classDetails);
      })
      .catch((error) => console.error("Error fetching stats:", error));
  };

  // For Select All Function
  const [SelectAll, setSelectAll] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState({});

  const handleSelectAll = (event) => {
      const isChecked = event.target.checked;
      setSelectAll(isChecked);
  
      const updatedClasses = {};
      currentSchedules.forEach(classes => {
        updatedClasses[classes.class_id] = isChecked;
      });
  
      setSelectedClasses(updatedClasses);
  };

  const handleSelectClasses = (event, class_id) => {
      const isChecked = event.target.checked;
  
      setSelectedClasses((prev) => {
          const updatedClasses = { ...prev, [class_id]: isChecked };
  
          const allSelected = Object.values(updatedClasses).every((val) => val === true);
          setSelectAll(allSelected);
  
          return updatedClasses;
      });
  };

  // Bottom Page Function
  const [currentPage, setCurrentPage] = useState(1);
  const schedulesPerPage = 5;

  const totalPages = Math.ceil(classes.classCount / schedulesPerPage);
  const startIndex = (currentPage - 1) * schedulesPerPage;
  const endIndex = startIndex + schedulesPerPage;
  const currentSchedules = filteredClass.slice(startIndex, endIndex);

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
          <button className={styles.addClass} onClick={() => setIsModalOpen(true)}>Add Class</button>
          <button className={styles.deleteClassButton} onClick={() => handleDeleteClick(null)}>Delete Selected</button>
        </div>
      </div>

      <table className={styles.schedulesTable}>
        <thead>
          <tr>
            <th className={styles.checkboxclassid}>
              <div className={styles.checkboxContainer}>
                <input type="checkbox" checked={SelectAll} onChange={handleSelectAll}/>
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
            <tr key={classes.class_id} className={styles.clickableRow}>
              <td className={styles.checkboxclassid}>
                <div className={styles.checkboxContainer}>
                  <input type="checkbox" checked={selectedClasses[classes.class_id] || false} onChange={(e) => handleSelectClasses(e, classes.class_id)} />
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
                <span className={styles.classParticipants}>{classes.participants_count} / {classes.max_participants}</span>
              </td>
              <td className={styles.actions} onClick={(e) => e.stopPropagation()}>
                <button className={styles.viewButton} onClick={() => handleViewClick(classes.class_id)}>
                  <Eye size={20} />
                </button>
                <button className={styles.editButton} onClick={() => 
                openEditModal(classes.class_id)}>
                  <Edit size={20} />
                </button>
                <button className={styles.deleteButton} onClick={() => handleDeleteClick(classes.class_id)}>
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

      {/* For Admin to Delete Schedule(Overlay) */}
      {showDeleteConfirm && (
          <div className={styles.modalOverlayDeleteM}>
              <div className={styles.modalDeleteM} style={{ textAlign: "center" }}>
                  <button className={styles.closeButton} onClick={() => setShowDeleteConfirm(false)}>
                  <X size={24} />
                  </button>
                  <Trash className={styles.deleteIcon} size={40}/>
                  <p style={{ marginBottom: "30px" }}>Are you sure you want to delete this class?</p>
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
                    {trainers.map((trainer) => (
                        <option key={trainer.user_id} value={trainer.user_id}>{trainer.name}</option>
                    ))}
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
                        
            <form className={styles.formContainer} onSubmit={(e) => handleEditSubmit(e, scheduleInfo)}>
              <div className={styles.classHeader}>
                <label>Class Name:</label>
                <input type="text" name="class_name" value={scheduleInfo.class_name} onChange={handleEditChange} required />
              </div>
                            
              <div className={styles.descriptionContainer}>
                <label>Description:</label>
                <textarea name="description" value={scheduleInfo.description} onChange={handleEditChange} required />
              </div>
                            
              <div className={styles.dateTimeContainer}>
                <div>
                  <label>Date:</label>
                  <input type="date" name="schedule_date" value={new Date(scheduleInfo.schedule_date).toLocaleDateString('en-CA')} onChange={handleEditChange} required />
                </div>
                <div>
                  <label>Start Time:</label>
                  <input type="time" name="start_time" value={scheduleInfo.start_time} onChange={handleEditChange} required />
                </div>
                <div>
                  <label>End Time:</label>
                  <input type="time" name="end_time" value={scheduleInfo.end_time} onChange={handleEditChange} required />
                </div>
              </div>
              
              <div className={styles.participantTrainerContainer}>
                <div>
                <label>Assigned Trainer:</label>
                  <select name="trainer_id" value={scheduleInfo.trainer_id} onChange={handleEditChange} required>
                    <option value="" disabled>Select trainer</option>
                    {trainers.map((trainer) => (
                        <option key={trainer.user_id} value={trainer.user_id}>{trainer.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.descriptionContainer}>
                <label>Max Participants:</label>
                <input type="number" name="max_participants" value={scheduleInfo.max_participants} onChange={handleEditChange} required />
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