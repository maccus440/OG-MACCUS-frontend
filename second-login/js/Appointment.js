// Set min date to today
const today = new Date().toISOString().split('T')[0];
document.getElementById('date').min = today;

// Doctor data
const doctors = [
  { name: "Dr. Sarah Lee", specialty: "Nutritionist", img: "https://i.pravatar.cc/150?img=12" },
  { name: "Dr. James Carter", specialty: "General Physician", img: "https://i.pravatar.cc/150?img=31" },
  { name: "Dr. Maya Patel", specialty: "Dermatologist", img: "https://i.pravatar.cc/150?img=44" },
  { name: "Dr. Alan Torres", specialty: "Cardiologist", img: "https://i.pravatar.cc/150?img=52" }
];

const grid = document.getElementById('doctorGrid');
let selectedDoctor = null;

// Render doctor cards
doctors.forEach((doc) => {
  const card = document.createElement('div');
  card.className = 'doctor-card';
  card.innerHTML = `
    <img src="${doc.img}" alt="${doc.name}">
    <h4>${doc.name}</h4>
    <p>${doc.specialty}</p>
  `;
  card.addEventListener('click', () => {
    document.querySelectorAll('.doctor-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedDoctor = doc.name;
  });
  grid.appendChild(card);
});

// Handle form submission
async function bookAppointment(event) {
  event.preventDefault(); // Prevent default form submission

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const dateInput = document.getElementById('date').value;
  const health = document.getElementById('health').value;
  const time = document.getElementById('time').value;

  if (!selectedDoctor) {
    alert("Please select a doctor.");
    return;
  }
  if (!name || !email || !dateInput || !time || !health) {
    alert("Please fill in all required fields.");
    return;
  }

  // Format date for modal
  const dateObj = new Date(dateInput);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedDate = dateObj.toLocaleDateString('en-US', options);

  // Prepare data to send to Formspree
  const formData = {
    doctor: selectedDoctor,
    name: name,
    email: email,
    phone: phone,
    date: dateInput,
    time: time,
    healthIssue: health
  };

  // Show "sending..." feedback (optional)
  const submitBtn = document.querySelector('#appointment button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  try {
    // Send to Formspree
    const response = await fetch('https://formspree.io/f/mpwoglkq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      // ✅ Success: clear form, show modal
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('phone').value = '';
      document.getElementById('date').value = '';
      document.getElementById('time').value = '';
      document.getElementById('health').value = '';
      document.querySelectorAll('.doctor-card').forEach(c => c.classList.remove('selected'));
      selectedDoctor = null;

      // Update modal content
      document.getElementById('modal-doctor').textContent = selectedDoctor;
      document.getElementById('modal-date').textContent = formattedDate;
      document.getElementById('modal-time').textContent = time;
      document.getElementById('modal-health').textContent = health;
      document.getElementById('modal-name').textContent = name;

      // Show modal
      document.getElementById('successModal').classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      const error = await response.json();
      console.error('Formspree error:', error);
      alert('Failed to send your appointment request. Please try again.');
    }
  } catch (err) {
    console.error('Network error:', err);
    alert('Network error. Please check your connection and try again.');
  } finally {
    // Restore button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// Modal close functions
function closeModal() {
  document.getElementById('successModal').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('successModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('successModal')) {
    closeModal();
  }
});

// Attach event listener to the form (not the button)
document.getElementById('appointment').addEventListener('submit', bookAppointment);





// document.getElementById('btn-start-scan').addEventListener('click', () => {
//   const qrReader = new Html5Qrcode("qr-reader");

//   // Start scanning (uses rear camera by default)
//   qrReader.start(
//     { facingMode: "environment" }, // use back camera
//     { fps: 10, qrbox: { width: 250, height: 250 } },
//     (decodedText, decodedResult) => {
//       // ✅ Success: QR code scanned
//       console.log("Scanned:", decodedText);
//       document.getElementById('result').innerText = "Scanned: " + decodedText;

//       // Example: Auto-fill email or appointment ID
//       try {
//         const data = JSON.parse(decodedText); // if QR encodes JSON
//         if (data.email) document.querySelector('input[name="email"]').value = data.email;
//         if (data.appointmentId) alert("Appointment ID: " + data.appointmentId);
//       } catch (e) {
//         // Assume plain text (e.g., URL, phone, ID)
//         if (decodedText.includes('@')) {
//           document.querySelector('input[name="email"]').value = decodedText;
//         }
//       }

//       qrReader.stop().then(() => console.log("Scanner stopped"));
//     },
//     (errorMessage) => {
//       // ❌ Error (e.g., permission denied)
//       console.log("Scan error:", errorMessage);
//     }
//   ).catch(err => {
//     console.error("Unable to start scanner", err);
//   });
// });