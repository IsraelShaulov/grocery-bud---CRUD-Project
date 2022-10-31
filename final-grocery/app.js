// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.querySelector('#grocery');
const submitBtn = document.querySelector('.submit-btn');
const groceryContainer = document.querySelector('.grocery-container');
const groceryList = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// edit option
let editElement;
let editFlag = false;
let editID = '';

// ****** EVENT LISTENERS **********
form.addEventListener('submit', addItem);

// clear items EVENT
clearBtn.addEventListener('click', clearItems);

// load items after coming back
window.addEventListener('DOMContentLoaded', setupItems);

// ****** FUNCTIONS **********
function addItem(event) {
  event.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  // if(value !== '' && editFlag === false) its like if(value && !editFlag)
  if (value !== '' && editFlag === false) {
    console.log('add item to the list');
    // create element
    createListItem(id, value);
    displayAlert('item added to the list', 'success');
    // show container
    groceryContainer.classList.add('show-container');
    // add to local storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
  } else if (value !== '' && editFlag === true) {
    console.log('editing');
    editElement.innerHTML = value;
    displayAlert('value changed', 'success');
    // edit local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    console.log('empty value');
    displayAlert('please enter value', 'danger');
  }
}

// display alert
function displayAlert(text, action) {
  alert.innerHTML = text;
  alert.classList.add(`alert-${action}`);
  // remove alert after 2 seconds
  setTimeout(function () {
    alert.innerHTML = '';
    alert.classList.remove(`alert-${action}`);
  }, 2000);
}

function clearItems() {
  const items = document.querySelectorAll('.grocery-item');
  if (items.length > 0) {
    items.forEach(function (item) {
      groceryList.removeChild(item);
    });
  }
  groceryContainer.classList.remove('show-container');
  displayAlert('empty list', 'danger');
  setBackToDefault();
  // remove my list(key)
  localStorage.removeItem('list');
}

// delete function
function deleteItem(event) {
  console.log('delete item');
  const element = event.currentTarget.parentElement.parentElement;
  console.log(element);
  const id = element.dataset.id;
  groceryList.removeChild(element);

  if (groceryList.children.length === 0) {
    groceryContainer.classList.remove('show-container');
  }
  displayAlert('item removed', 'danger');
  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
}

// edit function
function editItem(event) {
  console.log('edit item');
  const element = event.currentTarget.parentElement.parentElement;
  // set edit item
  editElement = event.currentTarget.parentElement.previousElementSibling;
  // set form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.innerHTML = 'edit';
}

// set back to default
//we set back to default cause we dont want user to start editing or removing items
function setBackToDefault() {
  console.log('set back to defualt');
  grocery.value = '';
  editFlag = false;
  editID = '';
  submitBtn.textContent = 'submit';
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
  // because ES6 i can write: grocery = {id, value}
  const grocery = { id: id, value: value };
  // check if list(key) exists - if yes, retrive it, else create empty array if not( list=key)
  let itemsArray = getLocalStorage();
  itemsArray.push(grocery);
  console.log(itemsArray);
  localStorage.setItem('list', JSON.stringify(itemsArray));
}

function removeFromLocalStorage(id) {
  let itemsArray = getLocalStorage();
  itemsArray = itemsArray.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem('list', JSON.stringify(itemsArray));
  console.log(itemsArray);
}

function editLocalStorage(id, value) {
  let itemsArray = getLocalStorage();
  itemsArray = itemsArray.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem('list', JSON.stringify(itemsArray));
}

function getLocalStorage() {
  // list = key
  // check if list(key) exists - if yes, return it, else create empty array if not
  return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}

// ***** SETUP ITEMS ******
function setupItems() {
  let itemsArray = getLocalStorage();
  if (itemsArray.length > 0) {
    itemsArray.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    groceryContainer.classList.add('show-container');
  }
}

function createListItem(id, value) {
  // instead of using createElement() i can use innerHTML, but innerHTML is less Secure
  const element = document.createElement('article');
  // add class
  element.classList.add('grocery-item');
  // add id
  const attribute = document.createAttribute('data-id');
  attribute.value = id;
  element.setAttributeNode(attribute);
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`;

  const deleteBtn = element.querySelector('.delete-btn');
  const editBtn = element.querySelector('.edit-btn');
  deleteBtn.addEventListener('click', deleteItem);
  editBtn.addEventListener('click', editItem);
  // append child
  groceryList.appendChild(element);
}
