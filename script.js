document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    loadCars();
    setupBookingForm();
});

async function checkAuthStatus() {
    try {
        const response = await fetch('/auth-status');
        const data = await response.json();
        
        if (data.isAuthenticated) {
            updateNavbarForUser(data.user);
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
}

function updateNavbarForUser(user) {
    const loginButton = document.querySelector('a[href="/login"]');
    if (loginButton) {
        loginButton.parentElement.style.display = 'none';
    }

    const nav = document.querySelector('.navbar-nav');
    const logoutButton = document.createElement('li');
    logoutButton.className = 'nav-item';
    logoutButton.innerHTML = '<a class="nav-link" href="/logout">Logout</a>';
    nav.appendChild(logoutButton);
}

async function loadCars() {
    try {
        const response = await fetch('/api/cars');
        if (!response.ok) {
            throw new Error('Failed to fetch cars');
        }
        const cars = await response.json();
        displayCars(cars);
    } catch (error) {
        console.error('Error loading cars:', error);
    }
}

function displayCars(cars) {
    const carsContainer = document.getElementById('carList');
    if (!carsContainer) return;

    carsContainer.innerHTML = cars.map(car => `
        <div class="col-md-4 mb-4">
            <div class="card">
                <img src="${car.image}" class="card-img-top" alt="${car.name}">
                <div class="card-body">
                    <h5 class="card-title">${car.name}</h5>
                    <p class="card-text">$${car.price}/day</p>
                    <button class="btn btn-primary" onclick="bookCar(${car.id})">Book Now</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function bookCar(carId) {
    try {
        const response = await fetch('/auth-status');
        const data = await response.json();
        
        if (!data.isAuthenticated) {
            alert('Please login to book a car');
            window.location.href = '/login';
            return;
        }

        // Add booking logic here
        console.log('Booking car:', carId);
    } catch (error) {
        console.error('Error booking car:', error);
    }
}

function setupBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const response = await fetch('/auth-status');
        const data = await response.json();
        
        if (!data.isAuthenticated) {
            alert('Please login to make a booking');
            window.location.href = '/login';
            return;
        }

        // Add form submission logic here
        console.log('Form submitted');
    });
}
