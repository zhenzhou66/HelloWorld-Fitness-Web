import React, { useState, useEffect } from "react";
import styles from "./Trainers.module.css";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { Trash, Edit, X } from "lucide-react";

const Trainers = () => {
    const [trainers, setTrainers] = useState({ trainersDetails: [], trainersCount: 0 });
    const [filteredTrainers, setFilteredTrainers] = useState([]); 

    // Fetching users
    useEffect(() => {
        fetch("http://localhost:5000/api/trainers/display")
            .then((response) => response.json())
            .then((data) => {
                setTrainers(data);
                setFilteredTrainers(data.trainersDetails); 
            })
            .catch((error) => console.error("Error fetching trainers:", error));
    }, []);

    // Formatting date function
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' }); 
    }

    // Searching function
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (search.trim() === "") {
            setFilteredTrainers(trainers.trainersDetails); 
        } else {
            setFilteredTrainers(
              trainers.trainersDetails.filter((trainers) => 
                trainers.username.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search, trainers.trainersDetails]);

    // For Add New Trainers
    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ 
        name: "", 
        email: "", 
        phone: "", 
        username: "",
        password: "",
        gender: "", 
        dob: "", 
        height: "", 
        weight: "", 
        fitnessGoals: "",
    });

    const openModal = () => setModalOpen(true);
    const closeModal = () => {
        setModalOpen(false);
        setFormData({
            name: "", 
            email: "", 
            phone: "", 
            username: "",
            password: "",
            gender: "", 
            dob: "", 
            height: "", 
            weight: "", 
            fitnessGoals: "",
        });
    };
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = 'http://localhost:5000/api/trainers/add';
        const method = 'POST';

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("username", formData.username);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("gender", formData.gender);
        formDataToSend.append("dob", formData.dob);
        formDataToSend.append("height", formData.height);
        formDataToSend.append("weight", formData.weight);
        formDataToSend.append("fitnessGoals", formData.fitnessGoals);
        formDataToSend.append("dateJoined", new Date().toLocaleDateString('en-CA'));
        
        if (formData.profilePicture) {
            formDataToSend.append("profilePicture", formData.profilePicture);
        }

        fetch(url, {
            method,
            body: formDataToSend,
        })
        .then(async (response) => {
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || "An error occurred while adding the trainer.");
            }
    
            alert(data.message); 
            fetchTrainers();
            closeModal();
        })
        .catch((error) => {
            alert(error.message); 
            console.error(error);
        });
    };

    const fetchTrainers = () => {
        fetch("http://localhost:5000/api/trainers/display")
          .then((response) => response.json())
          .then((data) => {
            setTrainers(data);
            setFilteredTrainers(data.trainersDetails);
          })
          .catch((error) => console.error("Error fetching stats:", error));
    };

    // For Select All Function
    const [SelectAll, setSelectAll] = useState(false);
    const [selectedTrainers, setSelectedTrainers] = useState({});

    const handleSelectAll = (event) => {
        const isChecked = event.target.checked;
        setSelectAll(isChecked);
    
        const updatedTrainers = {};
        currentTrainers.forEach(trainers => {
            updatedTrainers[trainers.user_id] = isChecked;
        });
    
        setSelectedTrainers(updatedTrainers);
    };

    const handleSelectTrainer = (event, user_id) => {
        const isChecked = event.target.checked;
    
        setSelectedTrainers((prev) => {
            const updatedTrainers = { ...prev, [user_id]: isChecked };
    
            const allSelected = Object.values(updatedTrainers).every((val) => val === true);
            setSelectAll(allSelected);
    
            return updatedTrainers;
        });
    };

    // For Delete Trainer
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [trainersToDelete, setTrainersToDelete] = useState([]);

    const handleDeleteClick = (user_id = null) => {
        let selectedTrainersIds;
    
        if (user_id) {
            selectedTrainersIds = [user_id];
        } else {
            selectedTrainersIds = Object.keys(selectedTrainers).filter(id => selectedTrainers[id]);
            
            if (selectedTrainersIds.length === 0) {
                alert("Please select at least one trainer to delete.");
                return;
            }
        }
        setTrainersToDelete(selectedTrainersIds);
        setShowDeleteConfirm(true);
    };

    const handleDelete = () => {
        fetch(`http://localhost:5000/api/trainers/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_ids: trainersToDelete }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            fetchTrainers(); 
            setSelectedTrainers({});
            setSelectAll(false);
            setShowDeleteConfirm(false);
            setTrainersToDelete([]);
        })
        .catch(error => {
            console.error("Error deleting trainers:", error);
        });
    };    

    // For Edit Trainer Details
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const[trainerInfo, setTrainerInfo] = useState(null);

    const openEditModal = (trainer) => {
        fetch(`http://localhost:5000/api/trainers/trainer-info/${trainer.user_id}`, {
            method: "GET",
        })
        .then(response => response.json())
        .then(data => { 
            setTrainerInfo(data);
            setIsEditModalOpen(true);
        })
        .catch(error => {
            console.error("Error fetching trainer information:", error);
        });  
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setTrainerInfo(null);
    };

    const handleEditChange = (e) => {
         const { name, value } = e.target;
         setTrainerInfo(prevState => ({ ...prevState, [name]: value }));
    };

    const handleEditGoalChange = (goal) => {
        setTrainerInfo(prevState => {
            const updatedGoals = prevState.fitness_goals.split(', ').includes(goal)
                ? prevState.fitness_goals.split(', ').filter(g => g !== goal)
                : [...prevState.fitness_goals.split(', '), goal];
            
            return { ...prevState, fitness_goals: updatedGoals.join(', ') };
        });
    };

    const handleSave = (e, updatedTrainer) => {
        e.preventDefault()
        console.log(updatedTrainer);

        fetch(`http://localhost:5000/api/trainers/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTrainer),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message); 
            closeEditModal();
            fetchTrainers(); 
        })
        .catch(error => {
            alert(error.message); 
            console.error("Error updating trainer:", error);
        });
    };

    // Bottom Page Function
    const [currentPage, setCurrentPage] = useState(1);
    const trainersPerPage = 9;

    const totalPages = Math.ceil(trainers.trainersCount / trainersPerPage);
    const startIndex = (currentPage - 1) * trainersPerPage;
    const endIndex = startIndex + trainersPerPage;
    const currentTrainers = filteredTrainers.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const [step, setStep] = useState(1);

    const handleNextStep = () => {
        if (step === 1) {
            if (!formData.name || !formData.email || !formData.phone || !formData.username || !formData.password || !formData.gender || !formData.dob) {
                alert("Please fill in all required fields before proceeding.");
                return;
            }
        }
        setStep(step + 1);
    };

    return (
        <div className={styles.memberContent}>
            <div className={styles.memberFunction}>
                <h3 className={styles.memberTitle}>All Trainers&nbsp;&nbsp;
                    <span className={styles.membersCount}>({trainers.trainersCount})</span>
                </h3>
                <div className={styles.memberActions}>
                    <div className={styles.searchContainer}>
                        <input 
                        type="text" 
                        className={styles.searchInput} 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        placeholder="Search" 
                        />
                    </div>
                    <button className={styles.addMemberButton} onClick={openModal}>Add Trainer</button>
                    <button className={styles.deleteMemberButton} onClick={() => handleDeleteClick(null)}>Delete Selected</button>
                </div>
            </div>

            <table className={styles.memberTable}>
                <thead>
                    <tr>
                        <th className={styles.checkboxuserid}>
                            <div className={styles.checkboxContainer}>
                                <input type="checkbox" checked={SelectAll} onChange={handleSelectAll} />
                                <span>User ID</span>
                            </div>
                        </th>
                        <th>Username</th>
                        <th>Gender</th>
                        <th>Phone Number</th>
                        <th>Date Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTrainers.map((trainer) => (
                        <tr key={trainer.user_id}>
                            <td className={styles.checkboxuserid}>
                                <div className={styles.checkboxContainer}>
                                    <input type="checkbox" checked={selectedTrainers[trainer.user_id] || false} onChange={(e) => handleSelectTrainer(e, trainer.user_id)}/>
                                    <span>{trainer.user_id}</span>
                                </div>
                            </td>
                            <td>
                                <div className={styles.mprofileContainer}>
                                    <img src={trainer.profile_picture? `http://localhost:5000/uploads/${trainer.profile_picture}`: `http://localhost:5000/uploads/default.jpg`} alt="Profile" className={styles.mprofilePicture} />
                                    <div className={styles.mprofileDetails}>
                                        <span className={styles.mprofileName}>{trainer.username}</span>
                                        <span className={styles.mprofileEmail}>{trainer.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    {trainer.gender === "Female" ? (
                                    <>
                                        <FemaleIcon style={{ color: "#ff69b4" }} />
                                        <span>Female</span>
                                    </>
                                    ) : trainer.gender === "Male" ? (
                                    <>
                                        <MaleIcon style={{ color: "#007bff" }} />
                                        <span>Male</span>
                                    </>
                                    ) : (
                                    <span>{trainer.gender}</span>
                                    )}
                                </div>
                            </td>
                            <td>{trainer.contact_number}</td>
                            <td>{formatDate(trainer.date_joined)}</td>
                            <td>
                                <button className={styles.editButton} onClick={() => openEditModal(trainer)}>
                                    <Edit size={20} />
                                </button>
                                <button className={styles.deleteButton} onClick={() => handleDeleteClick(trainer.user_id)}>
                                    <Trash size={20} />
                                </button>
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

            {/* For Admin to Delete Trainer(Overlay) */}
            {showDeleteConfirm && (
                <div className={styles.modalOverlayDeleteM}>
                    <div className={styles.modalDeleteM} style={{ textAlign: "center" }}>
                        <button className={styles.closeButton} onClick={() => setShowDeleteConfirm(false)}>
                        <X size={24} />
                        </button>
                        <Trash className={styles.deleteIcon} size={40}/>
                        <p style={{ marginBottom: "30px" }}>Are you sure you want to delete this trainer?</p>
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

            {/* For Admin to Add Trainer(Overlay) */}
            {isModalOpen && (
                <div className={styles.overlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <PersonAddAlt1Icon className={styles.AddMemberIcon} />
                            <span className={styles.textstyle}>Add New Trainer</span>
                            <X className={styles.XButton} onClick={closeModal} />
                        </div>
                    
                        <div className={styles.progressTabs}>
                            <div className={`${styles.tab} ${
                                step === 1 ? styles.activeTab : styles.inactiveTab
                                }`}
                                >
                                    Personal Information
                            </div>
                            <div className={`${styles.tab} ${
                                step === 2 ? styles.activeTab : styles.inactiveTab
                                }`}
                                >
                                    Fitness Goals
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.formContainer}>    
                            <div className={styles.formGrid}>
                                {step == 1 ? (
                                    <>
                                        <div className={styles.leftColumn}>
                                            <label>Name:</label>
                                            <input type="text" name="name" placeholder="Name as per IC" value={formData.name} onChange={handleChange} required />

                                            <label>Email:</label>
                                            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />

                                            <label>Phone Number:</label>
                                            <input type="text" name="phone" placeholder="Your phone number" value={formData.phone} onChange={handleChange} required />
                                
                                            <label>Username:</label>
                                            <input type="text" name="username" placeholder="Set your username" value={formData.username} onChange={handleChange} required />

                                            <label>Password:</label>
                                            <input type="password" name="password" placeholder="Set your password" value={formData.password} onChange={handleChange} required />
                                        </div>

                                        <div className={styles.rightColumn}>
                                            <label className={styles.genderContainer}>
                                                <label className={styles.genderLabel}>Gender:</label>
                                                <div className={styles.radioGroup}>
                                                    <label className={styles.radioLabel}>
                                                        <input className={styles.radioButton} type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} 
                                                        />
                                                        Male
                                                    </label>
                                                    <label className={styles.radioLabel}>
                                                        <input className={styles.radioButton} type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange}
                                                        />
                                                        Female
                                                    </label>
                                                </div>
                                            </label>                                        
                                        
                                            <label>Date of Birth:</label>
                                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                                            <label>Profile Picture:</label>
                                        <input type="file" name="profilePicture" onChange={(e) => setFormData({ ...formData, profilePicture: e.target.files[0] })} />
                                        </div>
                                    </>
                                ) : (
                                    <div className={styles.fitnessGoals}>
                                        <div className={styles.heightWeightContainer}>
                                            <div className={styles.inputGroup}>
                                                <label>Height:</label>
                                                <input type="number" name="height" placeholder="Enter Height" value={formData.height} onChange={handleChange} required />
                                                <span className={styles.unit}>cm</span>
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <label>Weight:</label>
                                                <input type="number" name="weight" placeholder="Enter weight" value={formData.weight} onChange={handleChange} required />
                                                <span className={styles.unit}>kg</span>
                                            </div>
                                        </div>

                                        <label>What are your fitness goals?</label>
                                        <div className={styles.fitnessGoalsOption}>
                                            {["Loss Weight", "Muscle Mass Gain", "Gain Weight", "Shape Body", "Others"].map((goal) => (
                                                <label key={goal} className={styles.goalOption}>
                                                    <input className={styles.radioButton} type="radio" name="fitnessGoals" value={goal} checked={formData.fitnessGoals == goal} onChange={handleChange}
                                                    />
                                                    {goal}    
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.footerbutton}>
                                {step > 1 && (
                                    <button 
                                        type="button" 
                                        className={styles.cancelButton} 
                                        onClick={() => setStep(step - 1)}
                                    >
                                        Back
                                    </button>
                                )}

                                {step < 2 ? (
                                    <button 
                                        type="button" 
                                        className={styles.nextButton}
                                        onClick={handleNextStep} 
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button 
                                        type="submit" 
                                        className={styles.nextButton} 
                                    >
                                        Submit
                                    </button>
                                )}
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className={styles.editOverlay}>
                    <div className={styles.editContent}>
                        <X className={styles.closeButton} onClick={closeEditModal} />
                        <h2>Edit Trainer Information</h2>
                        <form onSubmit={(e) => handleSave(e, trainerInfo)}>
                            <div className={styles.profileSection}>
                                <img src={trainerInfo.profile_picture? `http://localhost:5000/uploads/${trainerInfo.profile_picture}`: `http://localhost:5000/uploads/default.jpg`} alt="Profile" className={styles.profilePicture} />
                                <div>
                                    <label>Username:</label>
                                    <input type="text" name="username" value={trainerInfo.username} readOnly required/>
                                </div>
                            </div>
                            <hr className={styles.edithr} />
                            <h3 className={styles.edith3text}>Personal Information</h3>
                            <label>Name:</label>
                            <input type="text" name="name" value={trainerInfo.name} onChange={handleEditChange} required/>
                            <label>Gender:</label>
                            <div className={styles.radioGroup}>
                                <label className={styles.radioLabel}>
                                    <input className={styles.radioButton} type="radio" name="gender" value="Male" checked={trainerInfo.gender === "Male"} onChange={handleEditChange} 
                                    />
                                    Male
                                </label>
                                <label className={styles.radioLabel}>
                                    <input className={styles.radioButton} type="radio" name="gender" value="Female" checked={trainerInfo.gender === "Female"} onChange={handleEditChange}
                                    />
                                    Female
                                </label>
                            </div>                        
                            <label>Date of Birth:</label>
                            <input type="date" name="date_of_birth" value={new Date(trainerInfo.date_of_birth).toLocaleDateString('en-CA')} onChange={handleEditChange} required/>
                            <label>Email:</label>
                            <input type="email" name="email" value={trainerInfo.email} onChange={handleEditChange} required/>
                            <label>Phone Number:</label>
                            <input type="text" name="contact_number" value={trainerInfo.contact_number} onChange={handleEditChange} required/>
                            <hr className={styles.edithr}/>
                            <h3 className={styles.edith3text}>Fitness Information</h3>
                            <div className={styles.heightWeightContainer}>
                                <div className={styles.inputGroup}>
                                    <label>Height:</label>
                                    <input type="number" name="height" placeholder="Enter Height" value={trainerInfo.height} onChange={handleEditChange} required />
                                    <span className={styles.unit}>cm</span>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Weight:</label>
                                    <input type="number" name="weight" placeholder="Enter weight" value={trainerInfo.weight} onChange={handleEditChange} required />
                                    <span className={styles.unit}>kg</span>
                                </div>
                            </div>
                            <label>Fitness goals:</label>
                            <div className={styles.fitnessGoalsOption}>
                                {["Loss Weight", "Muscle Mass Gain", "Gain Weight", "Shape Body", "Others"].map((goal) => (
                                    <label key={goal} className={styles.goalOption}>
                                        <input className={styles.radioButton} type="radio" name="fitness_goals" value={goal}  checked={trainerInfo.fitness_goals == goal} onChange={handleEditChange}
                                        />
                                        
                                        {goal}    
                                    </label>
                                ))}
                            </div>
                            <div className={styles.buttonSection}>
                                <button type="button" onClick={closeEditModal} className={styles.cancelDeleteButton}>Cancel</button>
                                <button type="submit" className={styles.confirmDeleteButton} >Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )}

export default Trainers;