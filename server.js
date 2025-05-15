const express = require('express');
const cors = require('cors');
const app = express();
const trainerRoutes = require('./routes/trainerRoutes');
const memberRoutes = require('./routes/memberRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use(cors());
app.use(express.json());

app.use('/api', trainerRoutes);
app.use('/api', memberRoutes);
app.use('/api', adminRoutes);

app.get("/api/members/email/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const snapshot = await db.collection("members").where("memberEmail", "==", email).get();
    if (snapshot.empty) {
      return res.status(404).json({ message: "Member not found" });
    }

    const memberData = snapshot.docs[0].data();
    res.status(200).json(memberData);
  } catch (error) {
    console.error("Error fetching member by email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

