import React, { useState, useEffect } from 'react';
import { getAll, post, put, deleteById } from './restdb.js';
import './App.css';
import {CustomerList} from './CustomerList.js';
import { CustomerAddUpdateForm } from './CustomerAddUpdateForm.js';

function log(message){console.log(message);}

export function App(params) {
  let blankCustomer = { "id": -1, "name": "", "email": "", "password": "" };
  const [customers, setCustomers] = useState([]);
  const [formObject, setFormObject] = useState(blankCustomer);
  let mode = (formObject.id >= 0) ? 'Update' : 'Add';
  useEffect(() => { getCustomers() }, [formObject]);

  const getCustomers =  function(){
    log("in getCustomers()");
    getAll(setCustomers);
  }

  const handleListClick = function(item){
    log("in handleListClick()");
    if (formObject.id === item.id){
      setFormObject(blankCustomer);
    }
    else {
      setFormObject(item);
      }
  }

  const handleInputChange = function (event) {
    log("in handleInputChange()");
    const name = event.target.name;
    const value = event.target.value;
    let newFormObject = {...formObject}
    newFormObject[name] = value;
    setFormObject(newFormObject);
  }

  let onCancelClick = function () {
    log("in onCancelClick()");
    setFormObject(blankCustomer);
  }

  let onDeleteClick = function () {
    let postOpCallback = () => { setFormObject(blankCustomer); }
    if(formObject.id >= 0){
       deleteById(formObject.id, postOpCallback);
      } else {
      setFormObject(blankCustomer);
  }
}
  
  let onSaveClick = function () {
    let postOpCallback = () => { setFormObject(blankCustomer); getAll(setCustomers); }
    const inputName = formObject.name.trim();
    const inputEmail = formObject.email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inputName) {
      alert("Name cannot be blank.");
      return;
    }
    if (!inputEmail) {
      alert("Email cannot be blank.");
      return;
    }
    if (!emailPattern.test(inputEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    const inputNameLower = formObject.name.trim().toLowerCase();
    const inputEmailLower = formObject.email.trim().toLowerCase();

    if (mode === 'Add') {
      const isDuplicate = customers.some(item => 
        item.name.trim().toLowerCase() === inputNameLower
      );
      const isDuplicateb = customers.some(item =>
        item.email.trim().toLowerCase() === inputEmailLower
      );
      if (isDuplicate) {
        alert("Duplicate record: name already exists");
        return;
      }
      if (isDuplicateb) {
        alert("Duplicate record: email already exists");
        return;
      }
        post(formObject, postOpCallback);
    } else if (mode === 'Update') {
      const isDuplicatec = customers.some(item => 
        item.id !== formObject.id &&
        item.name.trim().toLowerCase() === inputNameLower
      );
      const isDuplicated = customers.some(item => 
        item.id !== formObject.id &&
        item.email.trim().toLowerCase() === inputEmailLower
      );
      if (isDuplicatec) {
        alert("Duplicate record: name already exists");
        return;
      }
      if (isDuplicated) {
        alert("Duplicate record: email already exists");
        return;
      }
        put(formObject, postOpCallback);
        return;
    }
  }

let pvars = {
    mode: mode,
    handleInputChange: handleInputChange,
    formObject: formObject,
    onDeleteClick: onDeleteClick,
    onSaveClick: onSaveClick,
    onCancelClick: onCancelClick
  }

return (
  <div>
    <CustomerList
      customers={customers}
      formObject={formObject}
      handleListClick={handleListClick}
    />
    <CustomerAddUpdateForm {...pvars}/>
  </div>
);

}

export default App;
