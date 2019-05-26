import React, {useState, useEffect} from 'react';
import {login, logout, getEmails, getCurrentUser} from "../../lib/outlookApi";

function Main(props) {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [emailList, setEmailList] = useState([]);


  useEffect(() => {
    setCurrentUser(getCurrentUser())
  }, []);


  const getMails = async () => {
    const {emails} = await getEmails();
    setEmailList(emails);
  };

  return <div>

    {currentUser !== null && <div>
      <div>
        <button onClick={getMails}>
          Get mails
        </button>
      </div>
      <div>
        {emailList.map((m, i) => {
          return <div key={i}>
            <div><b>{m.subject}</b></div>
            <div>{m.body.content}</div>
          </div>;
        })}
      </div>
    </div>}

  </div>;
}

export default Main;