import React, { useState } from "react";
import styles from "./Members.module.css";
import SearchIcon from "@mui/icons-material/Search";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

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
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", gender: "Male" });

    const openModal = () => setModalOpen(true);
    const closeModal = () => {
            setModalOpen(false);
            setFormData({ name: "", email: "", phone: "", gender: "Male" });
        };
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const newMember = {
            ...formData,
            userid: `UID${members.length + 1}`,
            dateJoined: new Date().toLocaleDateString(),
            mprofilePicture: "https://via.placeholder.com/40",
        };

        setMembers([...members, newMember]);
        closeModal();
    }

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

    return (
        <div className={styles.memberContent}>
            <div className={styles.memberFunction}>
                <h3 className={styles.memberTitle}>All Members</h3>
                <div className={styles.memberActions}>
                    <div className={styles.searchContainer}>
                        <SearchIcon className={styles.searchIcon} />
                        <input type="text" className={styles.searchInput} placeholder="Search" />
                    </div>
                <button className={styles.addMemberButton} onClick={openModal}>+ Add Member</button>
                <button className={styles.deleteMemberButton} onClick={handleDeleteClick}>🗑️ Delete Selected</button>
                </div>
            </div>

            <table className={styles.memberTable}>
                <thead>
                    <tr>
                        <th>
                            <input type="checkbox" checked={SelectAll} onChange={handleSelectAll} />
                            User ID</th>
                        <th>Username</th>
                        <th>Gender</th>
                        <th>Phone Number</th>
                        <th>Date Joined</th>
                        <th className={styles.actionsText}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMembers.map((member) => (
                        <tr key={member.userid}>
                            <td>
                                <input type="checkbox" checked={selectedMembers[member.userid] || false} onChange={(e) => handleSelectMember(e, member.userid)}/>
                                {member.userid}</td>
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
                                <button className={styles.editButton} onClick={() => openEditModal(member)}></button>
                                <button className={styles.deleteButton} onClick={handleDeleteClick}></button>
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
                        <PersonAddAlt1Icon className={styles.AddMemberIcon} />
                        <span>Add New Member</span>
                        <form onSubmit={handleSubmit}>
                            <table className={styles.progressTable}>
                                <tbody>
                                    <tr>
                                        <td className={styles.progress1}></td>
                                        <td><p className={styles.PersonalInfo}>Personal Information</p></td>
                                        
                                    </tr>
                                <div className={styles.progress2}></div>
                                <span className={styles.FitnessGoals}>Fitness Goals</span>
                                </tbody>
                            </table>
                            <div className={styles.formGroup}>
                            <label>Name:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>

                            <div className={styles.formGroup}>
                            <label>Email:</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>

                            <div className={styles.formGroup}>
                            <label>Phone:</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                            </div>

                            <div className={styles.formGroup}>
                            <label>Gender:</label>
                            <select name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            </div>

                            <div className={styles.modalButtons}>
                                <button type="submit">Add Member</button>
                                <button type="button" className={styles.closeBtn} onClick={closeModal}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )}

export default Members;