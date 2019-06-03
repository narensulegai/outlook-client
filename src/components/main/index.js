import React, {useState, useEffect, useContext} from 'react';
import {getFirstEmailPage, getEmails} from "../../lib/outlookApi";
import toCsv from '../../lib/toCsv'

import CurrentUserContext from '../../context/CurrentUserContext';

function Main() {
  const [emailList, setEmailList] = useState([]);
  const [nextPageLink, setNextPageLink] = useState(null);
  const [emailGroupName, setEmailGroupName] = useState('updateideabank');
  const emailGroupRef = React.createRef();

  useEffect(() => {
  }, []);

  const currentUser = useContext(CurrentUserContext);

  const getMails = async () => {
    const mailingGroup = emailGroupRef.current.value;
    const {emails, nextLink} = await getFirstEmailPage(mailingGroup);
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

  const updateEmailGroupName = () => {
    setEmailList([]);
    setEmailGroupName(emailGroupRef.current.value);
  };

  return <div>

    {currentUser !== null && <div>
      <div>Welcome {currentUser.name}!</div>

      <div>
        <span>Mailing Group</span>
        <input className='small-margin-left'
               type="text"
               value={emailGroupName}
               onChange={updateEmailGroupName}
               ref={emailGroupRef}/>
        <button className='small-margin-left' onClick={getMails}>Get emails</button>
        {nextPageLink && <button className='small-margin-left' onClick={nextPage}>Get more</button>}
        {emailList.length > 0 && <button className='small-margin-left' onClick={download}>Download as CSV</button>}
      </div>

      <div>
        {emailList.map((m, i) => {
          return <div key={i}>
            <div><b>{m.subject}</b></div>
          </div>;
        })}
      </div>

      <div>
        {emailList.length === 0 && <div>No emails to show</div>}
      </div>

    </div>}

    {currentUser === null && <div className='center'>
      Please log in to Outlook
    </div>}

  </div>;
}

export default Main;