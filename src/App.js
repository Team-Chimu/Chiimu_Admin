import React, { useState, useEffect } from 'react';
import './App.css';
import { domain } from './domain.js';
import AddBoxIcon from '@mui/icons-material/AddBox';
import StorageIcon from '@mui/icons-material/Storage';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

function App() {

  // stuff to boom database
  // password can be found in backend .env file under "SUPER_SECRET_PASSWORD"
  const [password, setPassword] = useState('')
  

  function displayPasswordBox() {
    return(
      <div className='password'>
        <h1>Enter Password</h1>
        <input type='text' placeholder='super secret passord' onChange={e => setPassword(e.target.value)}/>
      </div>
    )
  }

  const [week, setWeek] = useState()
  const [updatedWeek, setUpdatedWeek] = useState()
  function displayUpdateWeek() {
    return(
      <div className='week'>
        <h1>Update Week</h1>
        <AddBoxIcon className='icon'/>
        <p>Current Week: {week}</p>
        <input type='text' placeholder='change week to' onChange={e => setUpdatedWeek(e.target.value)}/>
        <button onClick={updateWeek}>Submit</button>
      </div>
    )
  }
  
  function updateWeek() {
    const requestOptions = {
      credentials: 'include',
      method: 'PUT',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ SUPER_SECRET_PASSWORD : password, updatedWeek : updatedWeek })
    }
    fetch(`${domain}/admin/updateweek`, requestOptions)
    .then(res => res.json())
    .then(data => {
        window.location.reload(false)
    })
  }

  function getWeek() {
    const requestOptions = {
      credentials: 'include',
      method: 'GET'
    }
    fetch(`${domain}/admin/currentweek`, requestOptions)
    .then(res => res.json())
    .then(data => {
        setWeek(data.currentWeek)
    })
  }

  function displayBoom() {
    return(
      <div className='boom'>
        <h1>Boom Database</h1>
        <StorageIcon className='icon'/>
        <button onClick={boom}>BOOM</button>
      </div>
    )
  }

  function boom() {
    const requestOptions = {
      credentials: 'include',
      method: 'DELETE',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ SUPER_SECRET_PASSWORD : password })
    }
    fetch(`${domain}/admin/boom`, requestOptions)
    .then(res => res.json())
    .then(data => {
        console.log(data)
    })
  }


  function displayExport() {
    return(
      <div className='export'>
        <h1>Export Data</h1>
        <FileDownloadIcon className='icon'/>
        <button onClick={exportData}>Export</button>
      </div>
    )
  }

  // stuff to export data
  function exportData() {
    const requestOptions = {
      credentials: 'include',
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ SUPER_SECRET_PASSWORD : password })
    }
    fetch(`${domain}/admin/exportdata`, requestOptions)
    .then(res => res.json())
    .then(data => {
        const element = document.createElement("a")
        const file = new Blob([JSON.stringify(data.message)], {type: 'text/json'});
        element.href = URL.createObjectURL(file);

        let date = new Date()
        let fileName = "ChimuDataExport" + date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours() ).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2) ;

        element.download = `${fileName}.json`;
        document.body.appendChild(element);
        element.click();
    })
  }


  const [questions, setQuestions] = useState("")
  function displayQuestionControlPanel() {
    return(
      <div className='questions'>
        <h1>Questions</h1>
        <HelpCenterIcon className='icon'/>
        <textarea value={questions} onChange={e => setQuestions(e.target.value)}/>
        <button onClick={updateQuestions}>Update Questions</button>
      </div>
    )
  }

  function updateQuestions() {
    
    let result = questions.split('\n')
    for (let i = 0; i < result.length; i++) {
      if (result[i] == '') {
        result.splice(i, 1)
        i--
      }
    }

    const requestOptions = {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ SUPER_SECRET_PASSWORD : password, questions : result })
    }
    fetch(`${domain}/admin/questions`, requestOptions)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
              console.log('good')
            } 
        })
  }

  function getQuestions() {
    const requestOptions = {
        credentials: 'include',
        method: 'GET'
    }
    fetch(`${domain}/api/userprofile/questions`, requestOptions)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
              let thingy = data.questions.questions
              let result = ""
              for (let i = 0; i < thingy.length; i++) {
                result += thingy[i] + "\n"
              }
              setQuestions(result)
            } 
        })
  }



  function displayTestAccounts() {
    return (
      <div className='testaccount'>
        <h1>Create Test Accounts</h1>
        <h2>for dev purposes</h2>
        <button onClick={createTestAccounts}>create test accounts</button>
      </div>
    )
    
  }

  function createTestAccounts() {
    const requestOptions = {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ SUPER_SECRET_PASSWORD : password })
    }
    fetch(`${domain}/admin/testaccounts`, requestOptions)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
              console.log('good')
            } 
        })
  }

  useEffect(() => {
    getQuestions();
    getWeek();
  }, [])


  return (
    <div className="App">
      {displayPasswordBox()}
      {displayUpdateWeek()}
      {displayBoom()}
      {displayExport()}
      {displayQuestionControlPanel()}
      {displayTestAccounts()}
    </div>
  );
}

export default App;
