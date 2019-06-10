import React, {useState, useEffect, useContext} from 'react';
import {getFirstEmailPage, getEmails, moveEmailsToFolder, autoReplyToSender} from "../../lib/outlookApi";
import toCsv from '../../lib/toCsv'

import CurrentUserContext from '../../context/CurrentUserContext';

function Main() {
  const [emailList, setEmailList] = useState([]);
  const [nextPageLink, setNextPageLink] = useState(null);
  const [emailGroupName, setEmailGroupName] = useState('updateideabank');
  const [mailboxName, setMailboxName] = useState('ideabank');
  const emailGroupRef = React.createRef();
  const mailboxNameRef = React.createRef();
  const autoReplyCheckbox = React.createRef();

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

  const download = async () => {
    const list = emailList.map(e => {
      const senderName = e.sender.emailAddress.name;
      const senderEmail = e.sender.emailAddress.address;
      return [senderName, senderEmail, e.subject, e.body.content];
    });


    list.unshift(['Sender Name', 'Sender Email', 'Subject', 'Content']);
    toCsv('email', list);
  };

  const moveToMailbox = async () => {
    const emailIds = emailList.map(m => m.id);
    if (autoReplyCheckbox.current.value === 'on') {
      await autoReplyToSender('Thank you for your contribution to IdeaBank', emailIds);
    }
    await moveEmailsToFolder(mailboxName, emailIds);
    await getMails();
    alert(`Moved ${emailList.length} mail(s) to ${mailboxName}`);
  };

  const updateEmailGroupName = () => {
    setEmailList([]);
    setEmailGroupName(emailGroupRef.current.value);
  };

  const handleMailboxNameChange = () => {
    setMailboxName(mailboxNameRef.current.value);
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
        {emailList.length > 0 &&
        <React.Fragment>
          <button className='small-margin-left' title={'Download emails as CSV'} onClick={download}>Download</button>
          <span className='small-margin-left'>Move all to mailbox</span>
          <input type="text"
                 className='small-margin-left'
                 value={mailboxName}
                 onChange={handleMailboxNameChange}
                 ref={mailboxNameRef}/>
          <span className='small-margin-left'>Auto reply</span>
          <input type="checkbox" ref={autoReplyCheckbox}/>
          <button title={`Move all emails to folder ${mailboxName}`}
                  className='small-margin-left' onClick={moveToMailbox}>
            Move
          </button>
          <span className='small-margin-left'>*Mailbox names are case insensitive</span>
        </React.Fragment>}
      </div>


      {emailList.length > 0 &&
      <table>
        <thead>
        <tr>
          <th>Subject</th>
        </tr>
        </thead>
        <tbody>
        {emailList.map((m, i) => {
          return <tr key={i}>
            <td>{m.subject}</td>
          </tr>;
        })}
        </tbody>

      </table>}

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