import React, {useState, useEffect, useContext} from 'react';
import {getEmails} from "../../lib/outlookApi";
import toCsv from '../../lib/toCsv'

import CurrentUserContext from '../../context/CurrentUserContext';

function Main() {
  const [emailList, setEmailList] = useState([]);
  const [nextPageLink, setNextPageLink] = useState(null);


  useEffect(() => {
  }, []);

  const currentUser = useContext(CurrentUserContext);

  const getMails = async () => {
    const {emails, nextLink} = await getEmails();
    setNextPageLink(nextLink);
    setEmailList(emails);
  };

  const nextPage = async () => {
    const {emails, nextLink} = await getEmails(nextPageLink);
    setNextPageLink(nextLink);
    setEmailList(emailList.concat(emails));
  };


  const download = () => {
    const list = emailList.map(e => {
      const senderName = e.sender.emailAddress.name;
      const senderEmail = e.sender.emailAddress.address;
      return [senderName, senderEmail, e.subject, e.body.content];
    });
    list.unshift(['Sender Name', 'Sender Email', 'Subject', 'Content']);
    toCsv('email', list);
  };

  return <div>

    {currentUser !== null && <div>
      Welcome {currentUser.name}
      <div>
        <button onClick={getMails}>
          Get emails from UpdateIdeaBank mailing group
        </button>
        {nextPageLink && <button onClick={nextPage}>Get more</button>}
        {emailList.length > 0 && <button onClick={download}>Download as CSV</button>}
      </div>
      <div>
        {emailList.map((m, i) => {
          return <div key={i}>
            <div><b>{m.subject}</b></div>
          </div>;
        })}
      </div>
    </div>}

  </div>;
}

export default Main;