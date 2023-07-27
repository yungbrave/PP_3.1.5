// получение ролей
const allRoles = fetch('/admin/roles')
    .then(response => response.json())

//заполнение выбора роли
allRoles.then(e => {
    let cod = ``
    for (const i in e) {
        cod += `<option value = ${e[i].id}>${e[i].name.replace("ROLE_", "")}</option>`
    }
    document.getElementById('rolesAddNewUser').innerHTML = cod;
})

//получение пользователя
const currentUser = fetch('/admin/currentUser')
    .then(response => response.json());
//вызов заполнение навбара
currentUser.then(data => makeNavbarWithCurrentUser(data))
    .catch(error => console.log(error));
//реализация заполнения навбара
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

//получение всех юзеров
const allUsers = fetch('/admin/users')
    .then(response => response.json());

//вызов заполнения таблицы юзеров
allUsers.then(data => makeUsersTableBody(data))
    .catch(error => console.log(error));

//реализация заполнения таблицы юзеров
function makeUsersTableBody(data) {
    let allUsersTableBody = '';
    for (let i = 0; i < data.length; i++) {
        allUsersTableBody += `<tr>
        <td>${data[i].id}</td>
        <td>${data[i].email}</td>
        <td>
        <span>`;
        data[i].roles.forEach(e => {
            let roleStr = `${e.name}`;
            let newStr = roleStr.replace('ROLE_', ' ');
            allUsersTableBody += `${newStr}`;
        });
        allUsersTableBody += `</span>
        </td>
        <td>
        <button class="btn btn-info" id="editUserButton" data-toggle="modal"
        data-target="#editModal">Edit</button>
        </td>
        <td>
        <button class="btn btn-danger" id="deleteUserButton" data-toggle="modal"
        data-target="#deleteModal">Delete</button>
        </td>
        </tr>`;
        document.getElementById('usersTableBody').innerHTML = allUsersTableBody;
    }
}

//добавление строки в таблицу
function makeTr(data) {
    let newRow = document.createElement('tr')
    let newUsersTableBody = ''
    newUsersTableBody += `<tr>
    <td>${data.id}</td>
    <td>${data.email}</td>
    <td>
    <span>`;
    data.roles.forEach(e => {
        let roleStr = `${e.name}`;
        let newStr = roleStr.replace('ROLE_', ' ');
        newUsersTableBody += `${newStr}`;
    });
    newUsersTableBody += `</span>
    </td>
    <td>
    <button class="btn btn-info" id="editUserButton" data-toggle="modal"
    data-target="#editModal">Edit</button>
    </td>
    <td>
    <button class="btn btn-danger" id="deleteUserButton" data-toggle="modal"
    data-target="#deleteModal">Delete</button>
    </td>
    </tr>`;
    newRow.innerHTML = newUsersTableBody;
    document.getElementById('usersTableBody').appendChild(newRow);
}

//добавление нового юзера
const formNU = document.getElementById('newUserForm')
formNU.addEventListener('submit', createNewUser)

async function createNewUser(event) {
    event.preventDefault()//меняет дефолтное свойство кнопки отправки формы
    let roleHtmlEl = document.getElementById('rolesAddNewUser')
    let rolesSelected = []
    for (let i = 0; i < roleHtmlEl.options.length; i++) {
        if (roleHtmlEl.options[i].selected) {
            rolesSelected.push({id: roleHtmlEl.options[i].value, name: 'ROLE_' + roleHtmlEl.options[i].innerHTML})
        }
    }
    await fetch('/admin/new', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({
            email: formNU.email.value,
            password: formNU.email.value,
            roles: rolesSelected
        })

    })
        .then(response => response.json())
        .then(data => {
            makeTr(data)
            formNU.reset()
        })
    document.getElementById('nav-home-tab').click()
}

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e.target)
        }
    })
}

//изменение юзера
const idEdit = document.getElementById('idCurrentUserEdit')
const firstNameEdit = document.getElementById('firstNameCurrentUserEdit')
const lastNameEdit = document.getElementById('lastNameCurrentUserEdit')
const ageEdit = document.getElementById('ageCurrentUserEdit')
const emailEdit = document.getElementById('emailCurrentUserEdit')
const passwordEdit = document.getElementById('passwordCurrentUserEdit')
const rolesEdit = document.getElementById('rolesEditUser')

let rowEdit = null

on(document, 'click', '#editUserButton', e => {
    rowEdit = e.parentNode.parentNode
    idEdit.value = rowEdit.children[0].innerHTML
    firstNameEdit.value = rowEdit.children[1].innerHTML
    lastNameEdit.value = rowEdit.children[2].innerHTML
    ageEdit.value = rowEdit.children[3].innerHTML
    emailEdit.value = rowEdit.children[4].innerHTML
    passwordEdit.value = ''
    let options = ''
    allRoles.then(e => {
        e.forEach(role => {
            let selected = rowEdit.children[5].innerHTML.includes(role.name.replace('ROLE_', '')) ? 'selected' : ''
            options += `<option value="${role.id}" ${selected}>${role.name.replace('ROLE_', '')}</option>`
        })
        rolesEdit.innerHTML = options;
    })
    $('#editModal').modal('show');
})

document.getElementById('editForm').addEventListener('submit', e => {
    e.preventDefault()
    let rolesEd = document.getElementById('rolesEditUser')
    let rolesEditSelected = []
    let rolesEditCell = ''
    for (let i = 0; i < rolesEd.options.length; i++) {
        if (rolesEd.options[i].selected) {
            rolesEditSelected.push({id: rolesEd.options[i].value, name: 'ROLE_' + rolesEd.options[i].innerHTML})
            rolesEditCell += rolesEd.options[i].innerHTML + ' '
        }
    }
    fetch('/admin/edit', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({
            id: idEdit.value,
            firstName: firstNameEdit.value,
            lastName: lastNameEdit.value,
            age: ageEdit.value,
            email: emailEdit.value,
            password: passwordEdit.value,
            roles: rolesEditSelected
        })

    })
        .then(response => response.json())
    rowEdit.children[1].innerHTML = firstNameEdit.value
    rowEdit.children[2].innerHTML = lastNameEdit.value
    rowEdit.children[3].innerHTML = ageEdit.value
    rowEdit.children[4].innerHTML = emailEdit.value
    rowEdit.children[5].innerHTML = rolesEditCell
    document.getElementById('closeEdit').click()
})

//удаление юзера
const idDelete = document.getElementById('idCurrentUserDelete')
const firstNameDelete = document.getElementById('firstNameCurrentUserDelete')
const lastNameDelete = document.getElementById('lastNameCurrentUserDelete')
const ageDelete = document.getElementById('ageCurrentUserDelete')
const emailDelete = document.getElementById('emailCurrentUserDelete')
const rolesDelete = document.getElementById('rolesDeleteUser')

let rowDelete = null

on(document, 'click', '#deleteUserButton', e => {
    rowDelete = e.parentNode.parentNode
    idDelete.value = rowDelete.children[0].innerHTML
    firstNameDelete.value = rowDelete.children[1].innerHTML
    lastNameDelete.value = rowDelete.children[2].innerHTML
    ageDelete.value = rowDelete.children[3].innerHTML
    emailDelete.value = rowDelete.children[4].innerHTML
    let options = ''
    allRoles.then(e => {
        e.forEach(role => {
            if (rowDelete.children[5].innerHTML.includes(role.name.replace('ROLE_', ''))) {
                options += `<option value="${role.id}">${role.name.replace('ROLE_', '')}</option>`
            }
        })
        rolesDelete.innerHTML = options;
    })
    $('#deleteModal').modal('show');
})

document.getElementById('deleteForm').addEventListener('submit', e => {
    e.preventDefault()
    fetch('/admin/delete/' + rowDelete.children[0].innerHTML, {
        method: 'DELETE'
    }).then(() => {
        document.getElementById('closeDelete').click();
        rowDelete.parentNode.removeChild(rowDelete)
    })
})