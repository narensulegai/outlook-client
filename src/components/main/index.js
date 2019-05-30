import React, {useState, useEffect, useContext} from 'react';
import {getEmails} from "../../lib/outlookApi";
import CurrentUserContext from '../../context/CurrentUserContext';

function Main(props) {
  const [emailList, setEmailList] = useState([]);


  useEffect(() => {
  }, []);

  const currentUser = useContext(CurrentUserContext);

  const getMails = async () => {
    const {emails} = await getEmails();
    setEmailList(emails);
  };

  return <div>

    {currentUser !== null && <div>
      Welcome {currentUser.name}
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