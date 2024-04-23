// Function to show desktop notification
function showNotification(title, options) {
  if (Notification.permission === "granted") {
    new Notification(title, options);
  }
}

// Function to update the current time
function updateCurrentTime() {
  const currentTimeElement = document.getElementById("currentTime");
  const currentTime = new Date();
  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  const seconds = currentTime.getSeconds().toString().padStart(2, "0");
  currentTimeElement.textContent = `Time : ${hours} : ${minutes} : ${seconds}`;
}

// Update the current time every second
setInterval(updateCurrentTime, 1000);

// Update the current time immediately on page load
updateCurrentTime();

// Existing JavaScript code
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("medication-form");
  const remindersList = document.getElementById("reminders");

  // Request permission for desktop notifications
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
  } else {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        console.log("Notification permission granted");
      }
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const medicineName = document.getElementById("medicine-name").value;
    const dosage = document.getElementById("dosage").value;
    const time = document.getElementById("time").value;

    // Create new reminder item
    const reminderItem = document.createElement("li");
    reminderItem.classList.add("reminder-item"); // Add class for styling
    reminderItem.innerHTML = `
            <span class="medicine-name"><strong>Medication Name:</strong> ${medicineName}</span><br>
            <span class="dosage"><strong>Dosage:</strong> ${dosage}</span><br>
            <span class="Alert-Timing"><strong>Alert Timing:</strong> ${time}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

    // Add delete functionality
    const deleteButton = reminderItem.querySelector(".delete-btn");
    deleteButton.addEventListener("click", function () {
      remindersList.removeChild(reminderItem);
      // Remove the line after the reminder item
      remindersList.removeChild(line);
    });

    // Add edit functionality
    const editButton = reminderItem.querySelector(".edit-btn");
    editButton.addEventListener("click", function () {
      // Get the values of the current reminder item
      const currentMedicineName =
        reminderItem.querySelector(".medicine-name").textContent;
      const currentDosage = reminderItem.querySelector(".dosage").textContent;
      const currentTime =
        reminderItem.querySelector(".Alert-Timing").textContent;

      // Open the edit modal
      openEditForm(
        currentMedicineName,
        currentDosage,
        currentTime,
        reminderItem
      );
    });

    // Add new reminder item to the list
    remindersList.appendChild(reminderItem);

    // Add a line after the reminder item
    const line = document.createElement("hr");
    remindersList.appendChild(line);

    // Show a desktop notification for the reminder
    setupAlarm(time, medicineName, dosage);

    // Show an alert
    alert("Reminder added successfully!");

    // Clear form fields
    form.reset();
  });
// Function to open the edit form/modal
function openEditForm(medicineName, dosage, time, reminderItem) {
  // Assuming you have a modal with id 'editModal'
  const editModal = document.getElementById("editModal");

  // Populate the form fields with the current values
  document.getElementById("edit-medicine-name").value = medicineName;
  document.getElementById("edit-dosage").value = dosage;
  document.getElementById("edit-time").value = time;

  // Show the modal
  editModal.style.display = "block";

  // Clear the input fields
  document.getElementById("edit-medicine-name").value = "";
  document.getElementById("edit-dosage").value = "";
  document.getElementById("edit-time").value = "";

  // Show an alert
  alert("Edit form opened!");

  // Update the reminder item on save
  const editForm = document.getElementById("edit-medication-form");
  editForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const newMedicineName =
      document.getElementById("edit-medicine-name").value;
    const newDosage = document.getElementById("edit-dosage").value;
    const newTime = document.getElementById("edit-time").value;
    reminderItem.querySelector(
      ".medicine-name"
    ).innerHTML = `<strong>Medication Name:</strong> ${newMedicineName}`;
    reminderItem.querySelector(
      ".dosage"
    ).innerHTML = `<strong>Dosage:</strong> ${newDosage}`;
    reminderItem.querySelector(
      ".Alert-Timing"
    ).innerHTML = `<strong>Time of Intake:</strong> ${newTime}`;

    // Update alarm time for the reminder
    setupAlarm(newTime, newMedicineName, newDosage);

    editModal.style.display = "none";
  });
}


  // Close the edit modal when clicking on the close button
  const closeModal = document.querySelector(".close");
  closeModal.addEventListener("click", function () {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "none";
  });

  // Close the edit modal when clicking anywhere outside it
  window.onclick = function (event) {
    const editModal = document.getElementById("editModal");
    if (event.target == editModal) {
      editModal.style.display = "none";
    }
  };
});

function setupAlarm(reminderTime, medicineName, dosage) {
  const currentTime = new Date();
  const [hours, minutes] = reminderTime.split(":");
  const reminderDate = new Date();
  reminderDate.setHours(hours, minutes, 0, 0);

  // Calculate the time difference in milliseconds
  const timeDifference = reminderDate.getTime() - currentTime.getTime();

  // Set up the alarm
  if (timeDifference > 0) {
    setTimeout(() => {
      // Show desktop notification
      showNotification("Medication Reminder", {
        body: `It's time to take your ${medicineName}. Dosage: ${dosage}`,
      });

      // Show an alert
      alert(`It's time to take your ${medicineName} medicine!`);
    }, timeDifference);
  }
}
