//Add category form validation
const message = document.getElementById('message');
const hide = () => {
    message.style.display = 'none';
}
setTimeout(hide, 3000)
function validateForm() {
    var name = document.getElementById('name').value;
    var description = document.getElementById('description').value;

    document.getElementById('nameError').innerText = '';
    document.getElementById('descriptionError').innerText = '';

    var isValid = true;

    // Check if the name is empty or contains only whitespace
    if (name.trim() === '') {
        document.getElementById('nameError').innerText = 'Please enter a category name';
        isValid = false;
    }

    // Check if the description is empty or contains only whitespace
    if (description.trim() === '') {
        document.getElementById('descriptionError').innerText = 'Please enter a category description';
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault(); // Prevent the form from submitting if there are errors
    }
}


//Sign Up form validation 
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('regForm');

    form.addEventListener('submit', async function (event) {
        resetErrorMessages();

        validateField('signin-name', 'nameError', 'Please enter your name', isValidName);
        validateField('signin-email', 'emailError', 'Please enter your email', isValidEmail);
        validateField('signin-mno', 'mnoError', 'Please enter a valid 10-digit mobile number', isValidMobile);
        validateField('signin-password', 'passError', 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one digit', isValidPassword);

        function validateField(fieldId, errorId, errorMessage, validationFunction) {
            const inputField = document.getElementById(fieldId);
            const fieldValue = inputField.value.trim();
            const errorElement = document.getElementById(errorId);

            if (!validationFunction(fieldValue)) {
                event.preventDefault();
                displayErrorMessage(errorElement, errorMessage);
            }
        }

        function isValidName(name) {
            // Simple validation: Check if the name is not empty
            return name.length > 0;
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function isValidMobile(mobile) {
            const mobileRegex = /^[0-9]{10}$/;
            return mobileRegex.test(mobile);
        }

        function isValidPassword(password) {
            const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            return passRegex.test(password);
        }

        function displayErrorMessage(errorElement, message) {
            errorElement.textContent = message;
            errorElement.style.color = 'red';
        }

        function resetErrorMessages() {
            const nameError = document.getElementById('nameError');
            const emailError = document.getElementById('emailError');
            const mnoError = document.getElementById('mnoError');
            const passError = document.getElementById('passError');

            nameError.textContent = '';
            emailError.textContent = '';
            mnoError.textContent = '';
            passError.textContent = '';
        }
    });
});
































