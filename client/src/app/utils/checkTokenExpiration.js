// Function to check if token is expired and remove it
export const checkTokenExpiration = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('token'); // Remove the token if expired
            alert('Your session has expired. Please log in again.');
        }
    }
};


// Call this function on app initialization