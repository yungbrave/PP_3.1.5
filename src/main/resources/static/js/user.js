//получение пользователя
const currentUser = fetch('/user/currentUser')
    .then(response => response.json());
//вызов заполнение навбара
currentUser.then(data => makeNavbarWithCurrentUser(data))
    .catch(error => console.log(error));
//вызов заполнения таблицы пользователя
currentUser.then(data => makeCurrentUserTable(data))
// реализация заполнения таблицы пользователя
const makeCurrentUserTable = (data) => {
    let currentUserTableBody = `<tr>
    <td>${data.id}</td>
    <td>${data.firstName}</td>
    <td>${data.lastName}</td>
    <td>${data.age}</td>
    <td>${data.email}</td>
    <td>
    <span>`;
    data.roles.forEach(e => {
        let roleStr = `${e.name}`;
        let newStr = roleStr.replace('ROLE_', ' ');
        currentUserTableBody += `${newStr}`;
    });
    currentUserTableBody += `</span>
    </td>
    </tr>`;
    document.getElementById('currentUserTable').innerHTML = currentUserTableBody;
};
// реализация заполнения навбара
const makeNavbarWithCurrentUser = (data) => {
    let currentUserEmail = `${data.email}`;
    let rolesCU = ``;
    data.roles.forEach(e => {
        let roleStr = `${e.name}`;
        let newStr = roleStr.replace('ROLE_', ' ');
        rolesCU += `${newStr}`;
    });
    document.getElementById('navbarEmail').innerHTML = currentUserEmail;
    document.getElementById('navbarRoles').innerHTML = rolesCU;
};