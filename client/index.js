document.addEventListener('DOMContentLoaded', () => {
  fetch(`http://localhost:5000/`)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
})

const addBtn = document.getElementById('add-name-btn');
const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');

const handleEditRow = (id) => {
  const revealUpdateSection = document.querySelector('#update-row');
  revealUpdateSection.hidden = false;
  document.querySelector('#update-name-input').dataset.id = id;
}

const deleteRowById = (id) => {
  fetch(`http://localhost:5000/delete/${id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(data => {
      console.log(`DELETION SUCCESS? ${data.success}`);
      fetch(`http://localhost:5000/`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
    }
    )
}

document.querySelector('table tbody').addEventListener('click', (event) => {
  if (event.target.className === 'delete-row-btn') {
    deleteRowById(event.target.dataset.id);
  }
  if (event.target.className === 'edit-row-btn') {
    handleEditRow(event.target.dataset.id);
  }
})

const insertRowIntoTable = data => {
  const table = document.querySelector('table tbody');
  const doesTableDataExist = table.querySelector('.no-data');
  const newName = data.data;
  let tableHTML = '<tr>';

  for (const key in newName) {
    if (newName.hasOwnProperty(key)) {
      if (key === 'created_at') {
        newName[key] = new Date(newName[key]).toLocaleString();
      }
      tableHTML += `<td>${newName[key]}</td>`
    }
  }
  tableHTML += `<td><button class="delete-row-btn" data-id=${newName.id}>Delete</button></td>`
  tableHTML += `<td><button class="edit-row-btn" data-id=${newName.id} data-name=${newName.name}>Edit</button></td>`
  tableHTML += '</tr>';
  if (doesTableDataExist) {
    table.innerHTML = tableHTML;
  } else {
    const newRow = table.insertRow();
    newRow.innerHTML = tableHTML;
  }
}

const loadHTMLTable = (data) => {
  const table = document.querySelector('table tbody');
  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data<td></tr>";
    return;
  }

  let tableHTML = "";
  data.forEach(({ id, name, created_at }) => {
    tableHTML += "<tr>"
    tableHTML += `<td>${id}</td>`
    tableHTML += `<td>${name}</td>`
    tableHTML += `<td>${new Date(created_at).toLocaleString()}</td>`
    tableHTML += `<td><button class="delete-row-btn" data-id=${id}>Delete</button></td>`
    tableHTML += `<td><button class="edit-row-btn" data-id=${id}>Edit</button></td>`
    tableHTML += "</tr>"
  });
  table.innerHTML = tableHTML;

  addBtn.onclick = () => {
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";
    fetch('http://localhost:5000/create', {
      headers: {
        'Content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ name: name }),
    })
      .then(response => response.json())
      .then(data => insertRowIntoTable(data));
  }
}

updateBtn.onclick = () => {
  const updateNameInput = document.querySelector('#update-name-input');
  fetch(`http://localhost:5000/update`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      name: updateNameInput.value,
      id: updateNameInput.dataset.id,
    })
  })
  .then(res => res.json())
  .then(data => {
    fetch(`http://localhost:5000/`)
      .then(response => response.json())
      .then(data => loadHTMLTable(data['data']))
  })
}

searchBtn.onclick = () => {
  const searchName = document.querySelector('#search-input').value;
  fetch(`http://localhost:5000/search/${searchName}`)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}