const form = document.getElementById("bookingForm");
const message = document.getElementById("message");
const bookingsList = document.getElementById("bookingsList");
const showBtn = document.getElementById("showBookingsBtn");

// إرسال الحجز
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const room = document.getElementById("room").value;
  const date = document.getElementById("date").value;

  try {
    const res = await fetch("/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, room, date }),
    });

    const data = await res.json();

    message.textContent = data.message;

    if (res.status === 201) {
      message.style.color = "green";
      form.reset();
    } else {
      message.style.color = "red";
    }

  } catch (err) {
    message.textContent = "Something went wrong ❌";
    message.style.color = "red";
  }
});


// عرض الحجوزات
showBtn.addEventListener("click", async () => {
  bookingsList.innerHTML = "";

  try {
    const res = await fetch("/bookings");
    const data = await res.json();

    data.data.forEach((booking, index) => {
      const div = document.createElement("div");
      div.className = "booking-item";

      div.innerHTML = `
        <div>
          <strong>${booking.name}</strong>
          <span>Room: ${booking.room} | Date: ${booking.date}</span>
        </div>
        <button onclick="deleteBooking(${booking.id})">Delete</button>
      `;

      bookingsList.appendChild(div);
    });

  } catch (err) {
    message.textContent = "Failed to load bookings ❌";
    message.style.color = "red";
  }
});


// حذف حجز
async function deleteBooking(id) {
  try {
    await fetch(`/bookings/${id}`, {
      method: "DELETE",
    });

    message.textContent = "Booking deleted 🗑️";
    message.style.color = "orange";

    // تحديث القائمة بعد الحذف
    showBtn.click();

  } catch (err) {
    message.textContent = "Delete failed ❌";
    message.style.color = "red";
  }
}