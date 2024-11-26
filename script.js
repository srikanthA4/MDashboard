const apiURL = 'https://jsonplaceholder.typicode.com/users';

const userListTable = document.getElementById('userTableBody');
const userFormContainer = document.getElementById('userFormContainer');
const userForm = document.getElementById('userForm');
const addUserBtn = document.getElementById('addUserBtn');
const cancelBtn = document.getElementById('cancelBtn');
const submitBtn = document.getElementById('submitBtn');
const formTitle = document.getElementById('formTitle');

let currentEditingUserId = null;

// Fetch and display users
function fetchUsers() {
  fetch(apiURL)
    .then(response => response.json())
    .then(users => {
      userListTable.innerHTML = '';
      users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.name.split(' ')[0]}</td>
          <td>${user.name.split(' ')[1]}</td>
          <td>${user.email}</td>
          <td>${user.company.name}</td>
          <td>
            <button onclick="editUser(${user.id})">Edit</button>
            <button onclick="deleteUser(${user.id})">Delete</button>
          </td>
        `;
        userListTable.appendChild(row);
      });
    })
    .catch(error => alert('Error fetching users: ' + error));
}

// Add or Edit User
function addOrEditUser(event) {
  event.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const department = document.getElementById('department').value;

  const user = {
    name: `${firstName} ${lastName}`,
    email,
    company: { name: department }
  };

  if (currentEditingUserId) {
    fetch(`${apiURL}/${currentEditingUserId}`, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(updatedUser => {
        alert('User updated!');
        fetchUsers();
        resetForm();
      });
  } else {
    fetch(apiURL, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(newUser => {
        alert('User added!');
        fetchUsers();
        resetForm();
      });
  }
}

// Edit User
function editUser(id) {
  fetch(`${apiURL}/${id}`)
    .then(response => response.json())
    .then(user => {
      formTitle.textContent = 'Edit User';
      document.getElementById('firstName').value = user.name.split(' ')[0];
      document.getElementById('lastName').value = user.name.split(' ')[1];
      document.getElementById('email').value = user.email;
      document.getElementById('department').value = user.company.name;
      document.getElementById('userId').value = user.id;

      currentEditingUserId = user.id;
      userFormContainer.classList.remove('hidden');
    });
}

// Delete User
function deleteUser(id) {
  if (confirm('Are you sure you want to delete this user?')) {
    fetch(`${apiURL}/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        alert('User deleted!');
        fetchUsers();
      })
      .catch(error => alert('Error deleting user: ' + error));
  }
}

// Reset the form
function resetForm() {
  userForm.reset();
  userFormContainer.classList.add('hidden');
  currentEditingUserId = null;
}

// Event Listeners
addUserBtn.addEventListener('click', () => {
  formTitle.textContent = 'Add New User';
  userFormContainer.classList.remove('hidden');
});

cancelBtn.addEventListener('click', resetForm);
userForm.addEventListener('submit', addOrEditUser);

// Initial Fetch of Users
fetchUsers();
