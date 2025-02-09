import React, { useState } from "react";
import styles from "./Members.module.css";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { Trash, Edit, X } from "lucide-react";

const Members = () => {
    const [members, setMembers] = useState([
        // Sample for User Details
        {
            userid: "UID001",
            name: "Emily Lai",
            email: "emily.lai@example.com",
            gender: "Female",
            phone: "+60 12-345-6789",
            dateJoined: "Jan 5, 2023",
            mprofilePicture: "https://via.placeholder.com/40",
        },
        {
            userid: "UID002",
            name: "Alex W",
            email: "alexw@example.com",
            gender: "Male",
            phone: "+60 12-345-3859",
            dateJoined: "Jan 6, 2023",
            mprofilePicture: "https://via.placeholder.com/40",
        },
        {
            userid: "UID003",
            name: "Samantha Tan",
            email: "samantha.tan@example.com",
            gender: "Female",
            phone: "+60 12-567-4321",
            dateJoined: "Feb 10, 2023",
            mprofilePicture: "https://via.placeholder.com/40",
        },
        {
            userid: "UID004",
            name: "James Lee",
            email: "james.lee@example.com",
            gender: "Male",
            phone: "+60 11-222-3344",
            dateJoined: "Mar 1, 2023",
            profilePicture: "https://via.placeholder.com/40",
        },
        {
            userid: "UID005",
            name: "Chloe Lim",
            email: "chloe.lim@example.com",
            gender: "Female",
            phone: "+60 10-555-6667",
            dateJoined: "Mar 15, 2023",
            profilePicture: "https://via.placeholder.com/40",
        },
        {
            userid: "UID006",
            name: "Daniel Wong",
            email: "daniel.wong@example.com",
            gender: "Male",
            phone: "+60 14-123-7890",
            dateJoined: "Apr 5, 2023",
            profilePicture: "https://via.placeholder.com/40",
        },
        {
            userid: "UID007",
            name: "Sophia Ng",
            email: "sophia.ng@example.com",
            gender: "Female",
            phone: "+60 12-234-5678",
            dateJoined: "Apr 20, 2023",
            profilePicture: "https://via.placeholder.com/40",
        },
        {
            userid: "UID008",
            name: "Henry Tan",
            email: "henry.tan@example.com",
            gender: "Male",
            phone: "+60 16-789-4321",
            dateJoined: "May 1, 2023",
            profilePicture: "https://via.placeholder.com/40",
        },
        {
            userid: "UID009",
            name: "Liam Chen",
            email: "liam.chen@example.com",
            gender: "Male",
            phone: "+60 12-456-7890",
            dateJoined: "Jan 20, 2023",
            profilePic: "https://via.placeholder.com/40"
        },
        {
            userid: "UID010",
            name: "Sophia Tan",
            email: "sophia.tan@example.com",
            gender: "Female",
            phone: "+60 11-234-5678",
            dateJoined: "Feb 1, 2023",
            profilePic: "https://via.placeholder.com/40"
        },
    ]);

    // For Edit Member Details
    const [selectedMember, setSelectedMember] = useState(null);

    // For Add New Member
    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", gender: "Male", dob: "", height: "", weight: "", membershipPlan: "Standard Monthly", fitnessGoals: [],});

    const openModal = () => setModalOpen(true);
    const closeModal = () => {
            setModalOpen(false);
            setFormData({ name: "", email: "", phone: "", gender: "Male", dob: "", height: "", weight: "", membershipPlan: "Standard Monthly", fitnessGoals: [],});
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
        const newMember = {
            ...formData,
            userid: `UID${members.length + 1}`,
            dateJoined: new Date().toLocaleDateString(),
            mprofilePicture: "https://via.placeholder.com/40",
        };

        setMembers([...members, newMember]);
        console.log("Form Submitted", newMember);
        alert("Member succeddfully added!");
        closeModal();
    };

    // For Select All Function
    const handleSelectAll = (event) => {
        setSelectAll(event.target.checked);
        const newSelectedMembers ={};
        currentMembers.forEach(member => {
            newSelectedMembers[member.userid] = event.target.checked;
        });
        setSelectedMembers(newSelectedMembers);
    };

    const handleSelectMember = (event, userid) => {
        setSelectedMembers({
            ...selectedMembers,
            [userid]: event.target.checked,
        });
    };

    // For Delete Member
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [SelectAll, setSelectAll] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState({});

    const handleDeleteClick = () => {
        const selected = Object.keys(selectedMembers).filter(userid => selectedMembers[userid]);
        if (selected.length > 0) {
            setShowDeleteConfirm(true);
        } else {
            alert("Please select at least one member to delete.");
        }
    };
    
    const confirmDelete = () => {
        setMembers(members.filter(member => ~selectedMembers[member.userid]));
        setSelectedMembers({});
        setSelectAll(false);
        setShowDeleteConfirm(false);
    }

    // Bottom Page Function
    const [currentPage, setCurrentPage] = useState(1);
    const membersPerPage = 9;

    const totalPages = Math.ceil(members.length / membersPerPage);
    const startIndex = (currentPage - 1) * membersPerPage;
    const endIndex = startIndex + membersPerPage;
    const currentMembers = members.slice(startIndex, endIndex);

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
                        <input type="text" className={styles.searchInput} placeholder="Search" />
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
                        <tr key={member.userid}>
                            <td className={styles.checkboxuserid}>
                                <div className={styles.checkboxContainer}>
                                    <input type="checkbox" checked={selectedMembers[member.userid] || false} onChange={(e) => handleSelectMember(e, member.userid)}/>
                                    <span>{member.userid}</span>
                                </div>
                                </td>
                                <td>
                                    <div className={styles.mprofileContainer}>
                                        <img src={member.mprofilePicture} alt="Profile" className={styles.profilePicture} />
                                        <div className={styles.mprofileDetails}>
                                            <span className={styles.mprofileName}>{member.name}</span>
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
                            <td>{member.phone}</td>
                            <td>{member.dateJoined}</td>
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
                                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required 
                                        />
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
                                            <option>Standard Monthly</option>
                                            <option>Premium Monthly</option>
                                            <option>Standard Yearly</option>
                                            <option>Premium Yearly</option>
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