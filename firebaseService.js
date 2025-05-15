const db = require("../config/firebaseConfig");

const getAllTrainers = async () => {
  try {
    const trainersRef = db.collection("trainers");
    const snapshot = await trainersRef.get();

    if (snapshot.empty) {
      console.log("No trainers found");
      return [];
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting trainers:", error);
    return [];
  }
};
const getAllMembers = async () => {
  try {
    const membersRef = db.collection("members");
    const snapshot = await membersRef.get();

    if (snapshot.empty) {
      console.log("No members found");
      return [];
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting members:", error);
    return [];
  }
};

// New logic for deleting a trainer
const deleteTrainerById = async (id) => {
  try {
    const trainerRef = db.collection("trainers").doc(id);

    const doc = await trainerRef.get();
    if (!doc.exists) {
      console.log("Trainer not found");
      return false;
    }

    await trainerRef.delete();
    return true;
  } catch (error) {
    console.error("Error deleting trainer:", error);
    return false;
  }
};

// Logic for updating trainer data
const updateTrainerById = async (id, trainerData) => {
  try {
    const trainerRef = db.collection("trainers").doc(id);
    const doc = await trainerRef.get();

    if (!doc.exists) {
      console.log("Trainer not found");
      return false;
    }

    await trainerRef.update(trainerData);
    return true;
  } catch (error) {
    console.error("Error updating trainer:", error);
    return false;
  }
};

// Logic for updating trainer data
const updateMemberById = async (id, memberData) => {
  try {
    const memberRef = db.collection("members").doc(id);
    const doc = await memberRef.get();

    if (!doc.exists) {
      console.log("Member not found");
      return false;
    }

    await memberRef.update(memberData);
    return true;
  } catch (error) {
    console.error("Error updating member:", error);
    return false;
  }
};

const deleteMemberById = async (id) => {
  try {
    console.log("Deleting member with ID:", id); // Debug log
    const memberRef = db.collection("members").doc(id);

    const doc = await memberRef.get();
    if (!doc.exists) {
      console.log("Member not found with ID:", id); // Improved log
      return false;
    }

    await memberRef.delete();
    console.log("Member deleted successfully:", id);
    return true;
  } catch (error) {
    console.error("Error deleting member:", error);
    return false;
  }
};

const getClasses = async () => {
  const classesRef = db.collection("classes");
  const snapshot = await classesRef.get();

  if (snapshot.empty) {
    return [];
  }

  const classes = [];
  snapshot.forEach((doc) => {
    classes.push({ id: doc.id, ...doc.data() });
  });

  return classes;
};

const getPlans = async () => {
  const plansRef = db.collection("plans");
  const snapshot = await plansRef.get();

  if (snapshot.empty) {
    return [];
  }

  const plans = [];
  snapshot.forEach((doc) => {
    plans.push({ id: doc.id, ...doc.data() });
  });

  return plans;
};

module.exports = {
  getAllTrainers,
  getAllMembers,
  deleteTrainerById,
  getClasses,
  updateTrainerById,
  updateMemberById,
  deleteMemberById,
  getPlans,
};
