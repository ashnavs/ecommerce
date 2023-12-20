//login  form validation
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    form.addEventListener('submit', async function (event) {
        resetErrorMessages();


        validateField('singin-email', 'email-error', 'Email is required', isValidEmail);
        validateField('singin-password', 'password-error', 'Password is required', isValidPassword);

        function validateField(fieldId, errorId, errorMessage, validationFunction) {
            const inputField = document.getElementById(fieldId);
            const fieldValue = inputField.value.trim();
            const errorElement = document.getElementById(errorId);

            if (!fieldValue) {
                event.preventDefault();
                displayErrorMessage(errorElement, errorMessage);
            } else if (!validationFunction(fieldValue)) {
                event.preventDefault();
                displayErrorMessage(errorElement, 'Invalid ' + fieldId.replace('singin-', ''));
            }
        }

        function isValidEmail(email) {
            return email.includes('@');
        }

        function isValidPassword(password) {
            return password.length >= 6;
        }

        function displayErrorMessage(errorElement, message) {
            errorElement.textContent = message;
            errorElement.style.color = 'red';
        }

        function resetErrorMessages() {
            const emailError = document.getElementById('email-error');
            const passwordError = document.getElementById('password-error');

            emailError.textContent = '';
            passwordError.textContent = '';
        }
    });
});


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


//add adress 

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('billingForm'); // Change 'yourFormId' to the actual ID of your form

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            validateForm();
        });
    }

    function validateForm() {
        // Reset error messages
        resetErrorMessages();

        // Get form values
        var name = document.getElementById('name').value.trim();
        var country = document.getElementById('country').value.trim();
        var street = document.getElementById('street').value.trim();
        var houseno = document.getElementById('houseno').value.trim();
        var city = document.getElementById('city').value.trim();
        var state = document.getElementById('state').value.trim();
        var pincode = document.getElementById('pincode').value.trim();
        var mobile = document.getElementById('mobile').value.trim();
        var emailValue = document.getElementById('email').value.trim();

        // Regular expressions
        var nameRegex = /^[A-Za-z\s]+$/;
        var mobileRegex = /^[0-9]{10}$/;
        var emailRegex = /^\S+@\S+\.\S+$/;

        var hasErrors = false;

        // Validate name
        if (name === '' || !nameRegex.test(name)) {
            showError('nameError', 'Please enter a valid name');
            hasErrors = true;
        }

        // Validate country
        if (country === '') {
            showError('countryError', 'Please enter the country');
            hasErrors = true;
        }

        // Validate street
        if (street === '') {
            showError('streetError', 'Please enter the street');
            hasErrors = true;
        }

        // Validate houseno
        if (houseno === '') {
            showError('housenoError', 'Please enter the houseno');
            hasErrors = true;
        }

        // Validate city
        if (city === '') {
            showError('cityError', 'Please enter the city');
            hasErrors = true;
        }

        // Validate state
        if (state === '') {
            showError('stateError', 'Please enter the state');
            hasErrors = true;
        }

        // Validate pincode
        if (pincode === '' || !/^\d+$/.test(pincode)) {
            showError('pincodeError', 'Enter a valid numeric Pincode.');
            hasErrors = true;
        }

        // Validate mobile
        if (!mobileRegex.test(mobile)) {
            showError('mobileError', 'Please enter a valid 10-digit mobile number');
            hasErrors = true;
        }

        // Validate email
        if (!emailRegex.test(emailValue)) {
            showError('emailError', 'Please enter a valid email address');
            hasErrors = true;
        }

        // If there are errors, prevent form submission
        if (hasErrors) {
            return false;
        }

        // If all client-side validations pass, submit the form
        // ...
        return true;
    }

    function showError(errorId, errorMessage) {
        var errorElement = document.getElementById(errorId);
        errorElement.innerText = errorMessage;
        errorElement.style.color = 'red';
    }

    function resetErrorMessages() {
        // Reset all error messages
        var errorIds = [
            'nameError', 'countryError', 'streetError',
            'housenoError', 'cityError', 'stateError',
            'pincodeError', 'mobileError', 'emailError'
        ];

        errorIds.forEach(function (errorId) {
            document.getElementById(errorId).innerText = '';
        });
    }
});


// document.addEventListener('DOMContentLoaded', function () {
//     const form = document.getElementById('addressForm');

//     form.addEventListener('submit', function (event) {
//         resetErrorMessages();

//         validateField('name', 'nameError', 'Please enter a valid name', isValidName);
//         validateField('country', 'countryError', 'Please enter the country', isNonEmpty);
//         validateField('street', 'streetError', 'Please enter the street', isNonEmpty);
//         validateField('houseno', 'housenoError', 'Please enter the houseno', isNonEmpty);
//         validateField('city', 'cityError', 'Please enter the city', isNonEmpty);
//         validateField('state', 'stateError', 'Please enter the state', isNonEmpty);
//         validateField('pincode', 'pincodeError', 'Enter a valid numeric Pincode.', isValidPincode);
//         validateField('mobile', 'mobileError', 'Please enter a valid 10-digit mobile number', isValidMobile);
//         validateField('email', 'emailError', 'Please enter a valid email address', isValidEmail);

//         function validateField(fieldId, errorId, errorMessage, validationFunction) {
//             const inputField = document.getElementById(fieldId);
//             const fieldValue = inputField.value.trim();
//             const errorElement = document.getElementById(errorId);

//             if (!fieldValue) {
//                 event.preventDefault();
//                 displayErrorMessage(errorElement, errorMessage);
//             } else if (!validationFunction(fieldValue)) {
//                 event.preventDefault();
//                 displayErrorMessage(errorElement, 'Invalid ' + fieldId);
//             }
//         }

//         function isValidName(name) {
//             const nameRegex = /^[A-Za-z\s]+$/;
//             return nameRegex.test(name);
//         }

//         function isNonEmpty(value) {
//             return value.trim() !== '';
//         }

//         function isValidPincode(pincode) {
//             return /^\d+$/.test(pincode);
//         }

//         function isValidMobile(mobile) {
//             const mobileRegex = /^[0-9]{10}$/;
//             return mobileRegex.test(mobile);
//         }

//         function isValidEmail(email) {
//             const emailRegex = /^\S+@\S+\.\S+$/;
//             return emailRegex.test(email);
//         }

//         function displayErrorMessage(errorElement, message) {
//             errorElement.textContent = message;
//             errorElement.style.color = 'red';
//         }

//         function resetErrorMessages() {
//             const errorIds = [
//                 'nameError', 'countryError', 'streetError',
//                 'housenoError', 'cityError', 'stateError',
//                 'pincodeError', 'mobileError', 'emailError'
//             ];

//             errorIds.forEach(function (errorId) {
//                 document.getElementById(errorId).innerText = '';
//             });
//         }
//     });
// });


//edit category
// formValidations.js

document.addEventListener('DOMContentLoaded', function () {
    const message = document.getElementById('message');
    const nameField = document.getElementById('name');
    const descriptionField = document.getElementById('description');

    const hideMessage = () => {
        message.style.display = 'none';
    }

    setTimeout(hideMessage, 3000);

    function validateForm() {
        resetErrorMessages();

        var name = nameField.value.trim();
        var description = descriptionField.value.trim();
        var isValid = true;

        // Check if the name is empty or contains only whitespace
        if (name === '') {
            showError('nameError', 'Please enter a category name');
            isValid = false;
        }

        // Check if the description is empty or contains only whitespace
        if (description === '') {
            showError('descriptionError', 'Please enter a category description');
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault(); // Prevent the form from submitting if there are errors
        }
    }

    function showError(errorId, errorMessage) {
        var errorElement = document.getElementById(errorId);
        errorElement.innerText = errorMessage;
        errorElement.style.color = 'red';
    }

    function resetErrorMessages() {
        // Reset all error messages
        var errorIds = ['nameError', 'descriptionError'];

        errorIds.forEach(function (errorId) {
            document.getElementById(errorId).innerText = '';
        });
    }
});



//add product

document.addEventListener('DOMContentLoaded', function () {
    const message = document.getElementById('message');
    const hide = () => {
        message.style.display = 'none';
    }
    setTimeout(hide, 3000);

    const form = document.getElementById('productForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (validateForm()) {
            form.submit();
        }
    });

    function validateForm() {
        // Reset error messages
        resetErrorMessages();

        // Get form values
        var name = document.getElementById('name').value.trim();
        var brand = document.getElementById('brand').value.trim();
        var quantity = document.getElementById('quantity').value.trim();
        var model = document.getElementById('model').value.trim();
        var ram = document.getElementById('ram').value.trim();
        var storage = document.getElementById('storage').value.trim();
        var processor = document.getElementById('processor').value.trim();
        var screenSize = document.getElementById('screenSize').value.trim();
        var graphicsCard = document.getElementById('graphicsCard').value.trim();
        var osArchitecture = document.getElementById('osArchitecture').value.trim();
        var os = document.getElementById('os').value.trim();
        var description = document.getElementById('description').value.trim();
        var price = document.getElementById('price').value.trim();
        var discountPrice = document.getElementById('discountPrice').value.trim();

        // Check if at least one field is filled
        if (
            name === '' && brand === '' && quantity === '' && model === '' &&
            ram === '' && storage === '' && processor === '' && screenSize === '' &&
            graphicsCard === '' && osArchitecture === '' && os === '' &&
            description === '' && price === '' && discountPrice === ''
        ) {
            document.getElementById('generalError').innerText = 'Please fill in at least one field';
            return false;
        } else {
            document.getElementById('generalError').innerText = ''; // Clear general error message
        }

        // Validate each field
        validateField(name, 'nameError', 'Please enter a product name');
        validateField(brand, 'brandError', 'Please enter a brand');
        validateField(quantity, 'quantityError', 'Please enter a valid quantity', true);
        validateField(model, 'modelError', 'Please enter a model');
        validateField(ram, 'ramError', 'Please enter RAM information');
        validateField(storage, 'storageError', 'Please enter storage information');
        validateField(processor, 'processorError', 'Please enter processor information');
        validateField(screenSize, 'screenSizeError', 'Please enter screenSize information');
        validateField(graphicsCard, 'graphicsCardError', 'Please enter graphicsCard information');
        validateField(osArchitecture, 'osArchitectureError', 'Please enter a valid OS Architecture', true);
        validateField(os, 'osError', 'Please enter os information');
        validateField(description, 'descriptionError', 'Please enter a product description');
        validateField(price, 'priceError', 'Please enter a valid price', true);
        validateField(discountPrice, 'discountPriceError', 'Please enter a valid discountPrice', true);

        // Check if any errors occurred
        return document.querySelectorAll('.text-danger').length === 0;
    }

    function validateField(value, errorId, errorMessage, numeric = false) {
        const errorElement = document.getElementById(errorId);

        if (value.trim() === '') {
            displayErrorMessage(errorElement, 'This field is required');
        } else if (numeric && (isNaN(value) || parseFloat(value) <= 0)) {
            displayErrorMessage(errorElement, errorMessage);
        } else {
            errorElement.innerText = ''; // Clear the error message
        }
    }

    function displayErrorMessage(errorElement, message) {
        errorElement.innerText = message;
        errorElement.style.color = 'red';
    }

    function resetErrorMessages() {
        // Reset all error messages
        var errorIds = [
            'nameError', 'brandError', 'quantityError', 'modelError',
            'ramError', 'storageError', 'processorError', 'screenSizeError',
            'graphicsCardError', 'osArchitectureError', 'osError',
            'descriptionError', 'priceError', 'discountPriceError'
        ];

        errorIds.forEach(function (errorId) {
            document.getElementById(errorId).innerText = '';
        });

        document.getElementById('generalError').innerText = ''; // Clear general error message
    }
});



//edit product
document.addEventListener('DOMContentLoaded', function () {
    const message = document.getElementById('message');
    const hide = () => {
        message.style.display = 'none';
    }
    setTimeout(hide, 3000);

    const form = document.getElementById('editProduct');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (validateForm()) {
            form.submit();
        }
    });

    function validateForm() {
        // Reset error messages
        resetErrorMessages();

        // Get form values
        var name = document.getElementById('name').value.trim();
        var brand = document.getElementById('brand').value.trim();
        var quantity = document.getElementById('quantity').value.trim();
        var model = document.getElementById('model').value.trim();
        var ram = document.getElementById('ram').value.trim();
        var storage = document.getElementById('storage').value.trim();
        var processor = document.getElementById('processor').value.trim();
        var screenSize = document.getElementById('screenSize').value.trim();
        var graphicsCard = document.getElementById('graphicsCard').value.trim();
        var osArchitecture = document.getElementById('osArchitecture').value.trim();
        var os = document.getElementById('os').value.trim();
        var description = document.getElementById('description').value.trim();
        var price = document.getElementById('price').value.trim();
        var discountPrice = document.getElementById('discountPrice').value.trim();

        // Check if at least one field is filled
        if (
            name === '' && brand === '' && quantity === '' && model === '' &&
            ram === '' && storage === '' && processor === '' && screenSize === '' &&
            graphicsCard === '' && osArchitecture === '' && os === '' &&
            description === '' && price === '' && discountPrice === ''
        ) {
            document.getElementById('generalError').innerText = 'Please fill in at least one field';
            return false;
        } else {
            document.getElementById('generalError').innerText = ''; // Clear general error message
        }

        // Validate name
        if (name === '') {
            document.getElementById('nameError').innerText = 'Please enter a product name';
            return false;
        }

        // Validate brand
        if (brand === '') {
            document.getElementById('brandError').innerText = 'Please enter a brand';
            return false;
        }

        // Validate quantity
        if (quantity === '' || isNaN(quantity) || parseInt(quantity) <= 0) {
            document.getElementById('quantityError').innerText = 'Please enter a valid quantity';
            return false;
        }

        // Validate model
        if (model === '') {
            document.getElementById('modelError').innerText = 'Please enter a model';
            return false;
        }

        // Validate RAM
        if (ram === '') {
            document.getElementById('ramError').innerText = 'Please enter RAM information';
            return false;
        }

        // Validate Storage
        if (storage === '') {
            document.getElementById('storageError').innerText = 'Please enter storage information';
            return false;
        }

        // Validate Processor
        if (processor === '') {
            document.getElementById('processorError').innerText = 'Please enter processor information';
            return false;
        }

        // Validate Screen Size
        if (screenSize === '') {
            document.getElementById('screenSizeError').innerText = 'Please enter screenSize information';
            return false;
        }

        // Validate Graphics Card
        if (graphicsCard === '') {
            document.getElementById('graphicsCardError').innerText = 'Please enter graphicsCard information';
            return false;
        }

        // Validate OS Architecture
        if (osArchitecture === '' || isNaN(osArchitecture) || osArchitecture <= 0) {
            document.getElementById('osArchitectureError').innerText = 'Please enter a valid OS Architecture';
            return false;
        }

        // Validate OS
        if (os === '') {
            document.getElementById('osError').innerText = 'Please enter os information';
            return false;
        }

        // Validate Description
        if (description === '') {
            document.getElementById('descriptionError').innerText = 'Please enter a product description';
            return false;
        }

        // Validate Price
        if (price === '' || isNaN(price) || parseFloat(price) <= 0) {
            document.getElementById('priceError').innerText = 'Please enter a valid price';
            return false;
        }

        // Validate Discount Price
        if (discountPrice === '' || isNaN(discountPrice) || parseFloat(discountPrice) <= 0) {
            document.getElementById('discountPriceError').innerText = 'Please enter a valid discountPrice';
            return false;
        }

        // Form is valid, continue with submission
        return true;
    }

    function resetErrorMessages() {
        // Reset all error messages
        var errorIds = [
            'nameError', 'brandError', 'quantityError', 'modelError',
            'ramError', 'storageError', 'processorError', 'screenSizeError',
            'graphicsCardError', 'osArchitectureError', 'osError',
            'descriptionError', 'priceError', 'discountPriceError', 'generalError'
        ];

        errorIds.forEach(function (errorId) {
            document.getElementById(errorId).innerText = '';
        });
    }
});


//edit address

// document.addEventListener('DOMContentLoaded', function () {
//     const message = document.getElementById('message');
//     const hide = () => {
//         message.style.display = 'none';
//     }
//     setTimeout(hide, 3000);

//     const form = document.getElementById('editAddress');

//     form.addEventListener('submit', function (event) {
//         event.preventDefault();
//         if (validateForm()) {
//             form.submit();
//         }
//     });

//     function validateForm() {
//         // Reset error messages
//         resetErrorMessages();

//         // Get form values
//         var name = document.getElementById('name').value.trim();
//         var country = document.getElementById('country').value.trim();
//         var street = document.getElementById('street').value.trim();
//         var houseno = document.getElementById('houseno').value.trim();
//         var city = document.getElementById('city').value.trim();
//         var pincode = document.getElementById('pincode').value.trim();
//         var mobile = document.getElementById('mobile').value.trim();
//         var email = document.getElementById('email').value.trim();

//         var nameRegex = /^[A-Za-z\s]+$/;
//         var mobileRegex = /^[0-9]{10}$/;
//         var emailRegex = /^\S+@\S+\.\S+$/;

//         var hasErrors = false;

//         if (name === '' || !nameRegex.test(name)) {
//             showError('nameError', 'Please enter a valid name');
//             hasErrors = true;
//         }

//         if (country === '') {
//             showError('countryError', 'Please enter the country');
//             hasErrors = true;
//         }

//         if (street === '') {
//             showError('streetError', 'Please enter the street');
//             hasErrors = true;
//         }

//         if (houseno === '') {
//             showError('housenoError', 'Please enter the houseno');
//             hasErrors = true;
//         }

//         if (city === '') {
//             showError('cityError', 'Please enter the city');
//             hasErrors = true;
//         }

//         if (pincode === '' || !/^\d+$/.test(pincode)) {
//             showError('pincodeError', 'Enter a valid numeric Pincode.');
//             hasErrors = true;
//         }

//         if (!mobileRegex.test(mobile)) {
//             showError('mobileError', 'Please enter a valid 10-digit mobile number');
//             hasErrors = true;
//         }

//         if (!emailRegex.test(email)) {
//             showError('emailError', 'Please enter a valid email address');
//             hasErrors = true;
//         }

//         if (hasErrors) {
//             return false;
//         }

//         // Continue with form submission
//         return true;
//     }

//     function showError(errorId, errorMessage) {
//         var errorElement = document.getElementById(errorId);
//         errorElement.innerText = errorMessage;
//         errorElement.style.color = 'red';
//     }

//     function resetErrorMessages() {
//         var errorIds = [
//             'nameError', 'countryError', 'streetError',
//             'housenoError', 'cityError', 'pincodeError',
//             'mobileError', 'emailError'
//         ];

//         errorIds.forEach(function (errorId) {
//             document.getElementById(errorId).innerText = '';
//         });
//     }
// });




























