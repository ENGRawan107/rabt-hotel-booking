const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Temporary database
let bookings = [];

// Home route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Get all bookings
app.get("/bookings", (req, res) => {
  res.json({
    message: "Bookings fetched successfully",
    data: bookings,
  });
});

// Create new booking
app.post("/bookings", (req, res) => {
  const { name, room, date } = req.body;

  if (!name || !room || !date) {
    return res.status(400).json({
      message: "Please fill in all fields ❌",
    });
  }

  const isBooked = bookings.find(
    (booking) => booking.room === room && booking.date === date
  );

  if (isBooked) {
    return res.status(409).json({
      message: "This room is already booked on this date ❌",
    });
  }

  const newBooking = {
    id: bookings.length + 1,
    name,
    room,
    date,
  };

  bookings.push(newBooking);

  res.status(201).json({
    message: "Booking created successfully ✅",
    data: newBooking,
  });
});

// Delete booking
app.delete("/bookings/:id", (req, res) => {
  const id = Number(req.params.id);

  bookings = bookings.filter((booking) => booking.id !== id);

  res.json({
    message: "Booking deleted successfully 🗑️",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});