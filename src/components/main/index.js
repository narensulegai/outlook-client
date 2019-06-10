import React, {useState, useEffect, useContext} from 'react';
import {getFirstEmailPage, getEmails, applyCategoryToEmails} from "../../lib/outlookApi";
import toCsv from '../../lib/toCsv'

import CurrentUserContext from '../../context/CurrentUserContext';

function Main() {
  const [emailList, setEmailList] = useState([]);
  const [nextPageLink, setNextPageLink] = useState(null);
  const [emailGroupName, setEmailGroupName] = useState('updateideabank');
  const [categoryName, setCategoryName] = useState('ideabank');
  const emailGroupRef = React.createRef();
  const categoryNameRef = React.createRef();

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
    // await applyCategoryToEmails(categoryName, emailList.map(m => m.id));
    const list = emailList.map(e => {
      const categories = e.categories.join(',');
      const senderName = e.sender.emailAddress.name;
      const senderEmail = e.sender.emailAddress.address;
      return [categories, senderName, senderEmail, e.subject, e.body.content];
    });


    list.unshift(['Categories', 'Sender Name', 'Sender Email', 'Subject', 'Content']);
    toCsv('email', list);
  };

  const markAllWithCategory = async () => {
    await applyCategoryToEmails(categoryName, emailList.map(m => m.id));
  };

  const updateEmailGroupName = () => {
    setEmailList([]);
    setEmailGroupName(emailGroupRef.current.value);
  };

  const handleCategoryNameChange = () => {
    setCategoryName(categoryNameRef.current.value);
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
          <button className='small-margin-left' onClick={download}>Download all as CSV</button>
          <span className='small-margin-left'>Category name</span>
          <input type="text"
                 className='small-margin-left'
                 value={categoryName}
                 onChange={handleCategoryNameChange}
                 ref={categoryNameRef}/>
          <button className='small-margin-left' onClick={markAllWithCategory}>Mark all</button>
          <span>*Category names are case insensitive</span>
        </React.Fragment>}
      </div>


      {emailList.length > 0 &&
      <table>
        <thead>
        <tr>
          <th>Category</th>
          <th>Subject</th>
        </tr>
        </thead>
        <tbody>
        {emailList.map((m, i) => {
          return <tr key={i}>
            <td>{m.categories.join(',')}</td>
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