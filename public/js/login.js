//client side javascript for login page
/* eslint-disable */

//Note: client facing javascript code, and only mordern browsers can run async/await
//Axios is used to make http requests from the browser to the server

axios.defaults.withCredentials = true;

const login = async (email, password) => {
  // alert(email, password);
  console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        // email: email,
        email,
        // password: password,
        password,
      },
      withCredentials: true,
    });
    console.log(res);
  } catch (err) {
    console.log(err.response.data);
  }
};

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
