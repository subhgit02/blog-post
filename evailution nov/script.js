const API_URL = 'https://jsonplaceholder.typicode.com';
const postsContainer = document.getElementById('postsContainer');
const userDropdown = document.getElementById('userDropdown');
const sortDropdown = document.getElementById('sortDropdown');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const pageNumberDisplay = document.getElementById('pageNumber');

let posts = [];
let filteredPosts = [];
let users = [];
let currentPage = 1;
const postsPerPage = 6;
let currentUserId = 'all';
let currentSortOrder = 'asc';

// Fetch users and populate dropdown
async function fetchUsers() {
  const response = await fetch(`${API_URL}/users`);
  users = await response.json();
  populateUserDropdown();
}

// Populate user dropdown
function populateUserDropdown() {
  users.forEach(user => {
    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = user.name;
    userDropdown.appendChild(option);
  });
}

// Fetch posts
async function fetchPosts() {
  const response = await fetch(`${API_URL}/posts`);
  posts = await response.json();
  filterAndSortPosts();
  displayPosts();
}

// Filter and sort posts based on current selections
function filterAndSortPosts() {
  filteredPosts = posts.filter(post => currentUserId === 'all' || post.userId == currentUserId);

  filteredPosts.sort((a, b) => {
    if (currentSortOrder === 'asc') {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });
}

// Display posts with pagination
function displayPosts() {
  postsContainer.innerHTML = '';
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  const paginatedPosts = filteredPosts.slice(start, end);

  paginatedPosts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.innerHTML = `<h2>${post.title}</h2><p>${post.body}</p>`;
    postElement.addEventListener('click', () => openPostDetails(post.id));
    postsContainer.appendChild(postElement);
  });

  updatePaginationButtons();
}

// Update pagination button states
function updatePaginationButtons() {
  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage * postsPerPage >= filteredPosts.length;
  pageNumberDisplay.textContent = currentPage;
}

// Open post details in new tab
async function openPostDetails(postId) {
  const response = await fetch(`${API_URL}/posts/${postId}/comments`);
  const comments = await response.json();

  const postDetailWindow = window.open('', '_blank');
  postDetailWindow.document.write(`
    <html>
      <head><title>Post Details</title></head>
      <body>
        <h1>Post ${postId} Comments</h1>
        <ul>
          ${comments.map(comment => `<li><strong>${comment.name}</strong>: ${comment.body}</li>`).join('')}
        </ul>
      </body>
    </html>
  `);
}

// Event listeners
userDropdown.addEventListener('change', (e) => {
  currentUserId = e.target.value;
  currentPage = 1;
  filterAndSortPosts();
  displayPosts();
});

sortDropdown.addEventListener('change', (e) => {
  currentSortOrder = e.target.value;
  filterAndSortPosts();
  displayPosts();
});

prevPageButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    displayPosts();
  }
});

nextPageButton.addEventListener('click', () => {
  if (currentPage * postsPerPage < filteredPosts.length) {
    currentPage++;
    displayPosts();
  }
});

// Initialize
fetchUsers();
fetchPosts();
