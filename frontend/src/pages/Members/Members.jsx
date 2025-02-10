import React, { useState, useEffect } from "react";
import styles from "./Members.module.css";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { Trash, Edit, X } from "lucide-react";

const Members = () => {
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]); 

    // Fetching users
    useEffect(() => {
        fetch("http://localhost:5000/api/members/display")
            .then((response) => response.json())
            .then((data) => {
                setMembers(data.membersDetails || []);
                setFilteredMembers(data.membersDetails || []); 
            })
            .catch((error) => console.error("Error fetching members:", error));
    }, []);

    // Formatting date function
    function formatDate(dateString) {
        const date = new Date(dateString);
        // Convert to local timezone
        return date.toLocaleDateString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' }); 
    }

    // Searching function
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (search.trim() === "") {
            setFilteredMembers(members); 
        } else {
            setFilteredMembers(
                members.filter((member) => 
                    member.username.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search, members]);

    //Fetch membership plans
    const [membershipPlans, setMembershipPlans] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/members/membership-plans')
            .then((response) => response.json())
            .then((data) => {
                setMembershipPlans(data);
            })
            .catch((error) => console.error("Error fetching membership plans:", error));
    }, []);

    // For Add New Member
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
        membershipPlan: "", 
        fitnessGoals: [],
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
            membershipPlan: "", 
            fitnessGoals: [],
        });
    };
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleGoalChange = (goal) => {
        setFormData((prevData) => {
            const goals = prevData.fitnessGoals.includes(goal)
            ? prevData.fitnessGoals.filter((g) => g !== goal)
            : [...prevData.fitnessGoals, goal];
            return { ...prevData, fitnessGoals: goals };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = 'http://localhost:5000/api/members/add';
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
        formDataToSend.append("membershipPlan", formData.membershipPlan);
        formDataToSend.append("fitnessGoals", formData.fitnessGoals.join(", "));
        formDataToSend.append("dateJoined", new Date().toISOString().split('T')[0]);
        
        if (formData.profilePicture) {
            formDataToSend.append("profilePicture", formData.profilePicture);
        }

        fetch(url, {
            method,
            body: formDataToSend,
        })
        .then((response) => response.json())
        .then((data) => {
            alert('Member added successfully');
            fetchMembers();
            closeModal();
        })
        .catch((error) => {
            console.error(error);
        });
    };

    const fetchMembers = () => {
        fetch("http://localhost:5000/api/members/display")
          .then((response) => response.json())
          .then((data) => {
            setMembers(data);
            setFilteredMembers(data.membersDetails);
          })
          .catch((error) => console.error("Error fetching stats:", error));
    };

    // For Select All Function
    const [SelectAll, setSelectAll] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState({});

    const handleSelectAll = (event) => {
        setSelectAll(event.target.checked);
        const newSelectedMembers ={};
        currentMembers.forEach(member => {
            newSelectedMembers[member.user_id] = event.target.checked;
        });
        setSelectedMembers(newSelectedMembers);
    };

    const handleSelectMember = (event, user_id) => {
        setSelectedMembers({
            ...selectedMembers,
            [user_id]: event.target.checked,
        });
    };

    // For Delete Member
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDeleteClick = () => {
        const selectedMembersIds = Object.keys(selectedMembers).filter(user_id => selectedMembers[user_id]);
    
        if (selectedMembersIds.length === 0) {
            alert("Please select at least one member to delete.");
            return;
        }
    
        fetch(`http://localhost:5000/api/members/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ members_ids: selectedMembersIds }),
        })
        .then((response) => response.json())
        .then((data) => {
            alert(data.message);
            fetchMembers(); 
            setSelectedMembers({});
            setSelectAll(false);
            setShowDeleteConfirm(false);
        })
        .catch((error) => {
            console.error("Error deleting memberships:", error);
            setShowDeleteConfirm(false);
        });
    };    

    // For Edit Member Details
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const[selectedMember, setSelectedMember] = useState(null);

    const openEditModal = (member) => {
        setSelectedMember(member);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedMember(null);
    };

    const handleSave = (updatedMember) => {
        closeEditModal();
    }

    const EditMemberModal = ({ member, onClose, onSave }) => {
        const [editedMember, setEditedMember] = useState(member);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setEditedMember({ ...editedMember, [name]: value });
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            onSave(editedMember);
        };

        return (
            <div className={styles.editOverlay}>
                <div className={styles.editContent}>
                    <span>Edit Member Information</span>
                    <X className={styles.XeditmButton} onClick={closeModal} />

                    <div className={styles.profileSection}>
                        <img src="/profile-placeholder.png" alt="Profile" className={styles.profilePicture} />
                    </div>

                    <h3>Personal Information</h3>
                    <form onSubmit={(e) => { e.preventDefault(); onSave(editedMember); }}>
                        <label>Name</label>
                        <input type="text" name="name" value={editedMember.name} onChange={handleChange} />
                        <label>Email</label>
                        <input type="email" name="email" value={editedMember.email} onChange={handleChange} />
                        <label>Phone</label>
                        <input type="text" name="phone" value={editedMember.phone} onChange={handleChange} />
                        <label>Membership Plan</label>
                        <select name="membershipPlan" value={editedMember.membershipPlan} onChange={handleChange}>
                            {membershipPlans.map((plan) => (
                                <option key={plan.membership_id} value={plan.membership_id}>{plan.plan_name}</option>
                            ))}
                        </select>
                        <button type="submit" className={styles.editUpdateBtn}>Update</button>
                        <button type="button" onClick={onClose} className={styles.editCancelBtn}>Cancel</button>
                    </form>
                </div>
            </div>
        )
    }

    // Bottom Page Function
    const [currentPage, setCurrentPage] = useState(1);
    const membersPerPage = 9;

    const totalPages = Math.ceil(members.length / membersPerPage);
    const startIndex = (currentPage - 1) * membersPerPage;
    const endIndex = startIndex + membersPerPage;
    const currentMembers = filteredMembers.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const [step, setStep] = useState(1);

    return (
        <div className={styles.memberContent}>
            <div className={styles.memberFunction}>
                <h3 className={styles.memberTitle}>All Members</h3>
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
                <button className={styles.addMemberButton} onClick={openModal}>+ Add Member</button>
                <button className={styles.deleteMemberButton} onClick={handleDeleteClick}>🗑️ Delete Selected</button>
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
                    {currentMembers.map((member) => (
                        <tr key={member.user_id}>
                            <td className={styles.checkboxuserid}>
                                <div className={styles.checkboxContainer}>
                                    <input type="checkbox" checked={selectedMembers[member.user_id] || false} onChange={(e) => handleSelectMember(e, member.user_id)}/>
                                    <span>{member.user_id}</span>
                                </div>
                            </td>
                            <td>
                                <div className={styles.mprofileContainer}>
                                    <img src={`http://localhost:5000/uploads/${member.profile_picture}`} alt="Profile" className={styles.mprofilePicture} />
                                    <div className={styles.mprofileDetails}>
                                        <span className={styles.mprofileName}>{member.username}</span>
                                        <span className={styles.mprofileEmail}>{member.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    {member.gender === "Female" ? (
                                    <>
                                        <FemaleIcon style={{ color: "#ff69b4" }} />
                                        <span>Female</span>
                                    </>
                                    ) : member.gender === "Male" ? (
                                    <>
                                        <MaleIcon style={{ color: "#007bff" }} />
                                        <span>Male</span>
                                    </>
                                    ) : (
                                    <span>{member.gender}</span>
                                    )}
                                </div>
                            </td>
                            <td>{member.contact_number}</td>
                            <td>{formatDate(member.date_joined)}</td>
                            <td>
                                <button className={styles.editButton} onClick={() => openEditModal(member)}>
                                    <Edit size={20} />
                                </button>
                                <button className={styles.deleteButton} onClick={handleDeleteClick}>
                                    <Trash size={20} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isEditModalOpen && (
                <EditMemberModal member={selectedMember} onClose={closeEditModal} onSave={handleSave} />
            )}

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

            {/* For Admin to Delete Member(Overlay) */}
            {showDeleteConfirm && (
                <div className={styles.modalOverlayDeleteM}>
                    <div className={styles.modalDeleteM}>
                        <h3>🗑️</h3>
                        <p>Are you sure you want to delete this member?</p>
                        <div className={styles.modalButtons}>
                            <button className={styles.cancelDeleteButton} onClick={() => setShowDeleteConfirm(false)}>No, Cancel</button>
                            <button className={styles.confirmDeleteButton} onClick={confirmDelete}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* For Admin to Add Member(Overlay) */}
            {isModalOpen && (
                <div className={styles.overlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <PersonAddAlt1Icon className={styles.AddMemberIcon} />
                            <span className={styles.textstyle}>Add New Member</span>
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
                                                        <input type="radio" name="gender" value="Male" checked={formData.gender === "Male"} onChange={handleChange} 
                                                        />
                                                        Male
                                                    </label>
                                                    <label className={styles.radioLabel}>
                                                        <input type="radio" name="gender" value="Female" checked={formData.gender === "Female"} onChange={handleChange}
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

                                        <label>Membership Plan:</label>
                                        <select name="membershipPlan" value={formData.addnmembershipPlan} onChange={handleChange} className={styles.addnmembershipDropdown}
                                        >
                                            {membershipPlans.map((plan) => (
                                                <option key={plan.membership_id} value={plan.membership_id}>{plan.plan_name}</option>
                                            ))}
                                        </select>

                                        <label>What are your fitness goals?</label>
                                        <div className={styles.fitnessGoalsOption}>
                                            {["Loss Weight", "Muscle Mass Gain", "Gain Weight", "Shape Body", "Others"].map((goal) => (
                                                <label key={goal} className={styles.goalOption}>
                                                    <input type="checkbox" value={goal} checked={formData.fitnessGoals.includes(goal)} onChange={() => handleGoalChange(goal)}
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
                                <button type="button" className={styles.cancelButton} onClick={() => setStep(step -1)}
                                >
                                Back
                                </button>
                                )}
                                <button 
                                type={step === 2 ? "Add Member" : "button"}
                                className={styles.nextButton}
                                onClick={step < 2 ? () => setStep(step + 1) : null}
                                >
                                {step === 2 ? "Submit" : "Next"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )}

export default Members;