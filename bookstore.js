// Cart state
let cartItems = [];
let isInitialized = false;


document.addEventListener('DOMContentLoaded', function() {
    if (!isInitialized) {
        initializeCart();
        initializeGallery();
        isInitialized = true;
    }

    loadSharedContent();
});

async function loadSharedContent() {
    const headerContainer = document.getElementById('header');
    const footerContainer = document.getElementById('footer');

    try {
        // Load header
        const headerResponse = await fetch('header.html');
        const headerData = await headerResponse.text();
        if (headerContainer) headerContainer.innerHTML = headerData;

        // Load footer
        const footerResponse = await fetch('footer.html');
        const footerData = await footerResponse.text();
        if (footerContainer) footerContainer.innerHTML = footerData;

        // Initialize Hamburger Menu after header loads
        initializeHamburgerMenu();
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

function initializeHamburgerMenu() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburgerMenu && navLinks) {
        // For debugging
        console.log('Hamburger menu initialized');
        hamburgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            console.log('Hamburger menu clicked');
        });
    } else {
        console.warn('Hamburger menu or nav links not found.');
    }
}


// Clear hint when the user starts typing again
function clearHint() {
    const hint = document.getElementById("hint");
    hint.style.display = "none";
}
// Add event listener to the subscribe button
document.getElementById('subscribe-button').addEventListener('click', function() {
    const emailInput = document.getElementById('email-input');
    const hint = document.getElementById("hint");
    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the input is empty
    if (emailValue === "") {
        hint.textContent = "Please fill out this field.";
        hint.style.display = "block";
        emailInput.focus();
        return;
    }

    // Check for invalid email format
    if (!emailRegex.test(emailValue)) {
        hint.textContent = "Please enter a valid email address.";
        hint.style.display = "block";
        emailInput.focus();
        return;
    }

    // If everything is valid
    hint.style.display = "none"; // Hide the hint
    emailInput.value = ""; // Clear the input
    alert("Thank you for subscribing!"); // Show confirmation
});




// Cart functionality
function initializeCart() {
    const cartModal = document.getElementById('cartModal');
    const viewCartBtn = document.getElementById('viewCartBtn');
    const closeModal = document.querySelector('.close-modal');
    const cartItemsContainer = document.getElementById('cartItems');
    const clearCartBtn = document.getElementById('clearCart');
    const processOrderBtn = document.getElementById('processOrder');
    const cartCount = document.getElementById('cartCount');

    if (!cartModal || !viewCartBtn || !closeModal || !cartItemsContainer || !clearCartBtn || !processOrderBtn || !cartCount) {
        console.error('Cart elements not found');
        return;
    }

    // Update cart count display
    function updateCartCount() {
        cartCount.textContent = `(${cartItems.length})`;
    }

    // Render cart items in modal
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            return;
        }

        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div>
                    <h4>${item.title}</h4>
                    <p>${item.category}</p>
                </div>
                <button class="remove-item" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                cartItems.splice(index, 1);
                updateCartCount();
                renderCartItems();
            });
        });
    }

    // Modal controls
    viewCartBtn.addEventListener('click', () => {
        cartModal.style.display = 'block';
        renderCartItems();
    });

    closeModal.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Clear cart functionality
    clearCartBtn.addEventListener('click', () => {
        cartItems = [];
        updateCartCount();
        renderCartItems();
    });

    // Process order functionality
    processOrderBtn.addEventListener('click', () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Thank you for your order! We will process it shortly.');
        cartItems = [];
        updateCartCount();
        renderCartItems();
        cartModal.style.display = 'none';
    });

    // Add to Cart button functionality
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.gallery-item');
            const title = item.querySelector('h4').textContent;
            const category = item.querySelector('.item-description p').textContent;

            cartItems.push({ title, category });
            updateCartCount();
            alert(`Added "${title}" to your cart!`);
        });
    });

    // Initialize cart count
    updateCartCount();
}

// Gallery functionality
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.textContent.trim();

            galleryItems.forEach(item => {
                const itemCategory = item.querySelector('.item-description p').textContent;
                if (category === 'All' || category === itemCategory) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Sorting functionality
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const sortBy = sortSelect.value;
            const itemsArray = Array.from(galleryItems);

            itemsArray.sort((a, b) => {
                const titleA = a.querySelector('h4').textContent.toLowerCase();
                const titleB = b.querySelector('h4').textContent.toLowerCase();

                switch (sortBy) {
                    case 'alphabetical':
                        return titleA.localeCompare(titleB);
                    case 'recent':
                        return Math.random() - 0.5; 
                    case 'popular':
                        return Math.random() - 0.5; 
                    case 'rating':
                        return Math.random() - 0.5; 
                    default:
                        return 0;
                }
            });

            const galleryGrid = document.querySelector('.gallery-grid');
            itemsArray.forEach(item => {
                galleryGrid.appendChild(item);
            });
        });
    }
}



const form = document.getElementById('form');
const result = document.getElementById('result');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(form);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);
  result.innerHTML = "Please wait..."

    fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                result.innerHTML = "Form submitted successfully";
            } else {
                console.log(response);
                result.innerHTML = json.message;
            }
        })
        .catch(error => {
            console.log(error);
            result.innerHTML = "Something went wrong!";
        })
        .then(function() {
            form.reset();
            setTimeout(() => {
                result.style.display = "none";
            }, 3000);
        });
});