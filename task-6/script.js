// Get form elements
const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const successMessage = document.getElementById('successMessage');
const charCount = document.getElementById('charCount');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');

// Email validation regex (RFC 5322 simplified)
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Character counter for message
messageInput.addEventListener('input', function() {
    const length = this.value.length;
    charCount.textContent = `${length} / 500`;
    
    if (length > 500) {
        charCount.style.color = '#ff3b30';
    } else if (length > 450) {
        charCount.style.color = '#ff9500';
    } else {
        charCount.style.color = '#86868b';
    }
});

// Real-time validation on blur
nameInput.addEventListener('blur', () => validateName());
emailInput.addEventListener('blur', () => validateEmail());
messageInput.addEventListener('blur', () => validateMessage());

// Remove error styling on input
[nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            this.classList.remove('error');
            hideError(this.id);
            hideFieldIcon(this.id, 'error');
        }
    });
});

// Validate name
function validateName() {
    const name = nameInput.value.trim();

    if (name === '') {
        showError('name', 'Please enter your name');
        return false;
    }

    if (name.length < 2) {
        showError('name', 'Name must be at least 2 characters');
        return false;
    }

    if (name.length > 50) {
        showError('name', 'Name is too long (max 50 characters)');
        return false;
    }

    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
        showError('name', 'Name can only contain letters, spaces, hyphens, and apostrophes');
        return false;
    }

    showSuccess('name');
    return true;
}

// Validate email
function validateEmail() {
    const email = emailInput.value.trim();

    if (email === '') {
        showError('email', 'Please enter your email address');
        return false;
    }

    if (!emailRegex.test(email)) {
        showError('email', 'Please enter a valid email address (e.g., name@example.com)');
        return false;
    }

    if (email.length > 100) {
        showError('email', 'Email is too long (max 100 characters)');
        return false;
    }

    showSuccess('email');
    return true;
}

// Validate message
function validateMessage() {
    const message = messageInput.value.trim();

    if (message === '') {
        showError('message', 'Please enter a message');
        return false;
    }

    if (message.length < 10) {
        showError('message', 'Message must be at least 10 characters');
        return false;
    }

    if (message.length > 500) {
        showError('message', 'Message is too long (max 500 characters)');
        return false;
    }

    showSuccess('message');
    return true;
}

// Show error message
function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    const errorIcon = document.getElementById(fieldId + 'ErrorIcon');
    
    input.classList.add('error');
    input.classList.remove('success');
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    // Show error icon
    if (errorIcon) {
        errorIcon.classList.add('show');
        hideFieldIcon(fieldId, 'success');
    }
}

// Show success state
function showSuccess(fieldId) {
    const input = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    const successIcon = document.getElementById(fieldId + 'SuccessIcon');
    
    input.classList.add('success');
    input.classList.remove('error');
    errorElement.classList.remove('show');
    
    // Show success icon
    if (successIcon) {
        successIcon.classList.add('show');
        hideFieldIcon(fieldId, 'error');
    }
}

// Hide error message
function hideError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    errorElement.classList.remove('show');
}

// Hide field icon
function hideFieldIcon(fieldId, type) {
    const icon = document.getElementById(fieldId + (type === 'success' ? 'SuccessIcon' : 'ErrorIcon'));
    if (icon) {
        icon.classList.remove('show');
    }
}

// Form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Hide previous success message
    successMessage.classList.remove('show');

    // Validate all fields
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    // If all validations pass
    if (isNameValid && isEmailValid && isMessageValid) {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            successMessage.classList.add('show');
            
            // Scroll to top smoothly
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Log form data
            console.log('Form submitted successfully!');
            console.log('Name:', nameInput.value.trim());
            console.log('Email:', emailInput.value.trim());
            console.log('Message:', messageInput.value.trim());

            // Reset form after 1.5 seconds
            setTimeout(() => {
                form.reset();
                nameInput.classList.remove('success');
                emailInput.classList.remove('success');
                messageInput.classList.remove('success');
                charCount.textContent = '0 / 500';
                charCount.style.color = '#86868b';
                
                // Hide field icons
                ['name', 'email', 'message'].forEach(field => {
                    hideFieldIcon(field, 'success');
                    hideFieldIcon(field, 'error');
                });
                
                // Remove loading state
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                
                // Hide success message after 4 seconds
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 2500);
            }, 1500);
        }, 1500); // Simulate network delay
    } else {
        // Scroll to first error
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
});