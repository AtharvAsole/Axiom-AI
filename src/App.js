import { useState, useEffect } from "react";
import Img1 from "./assets/user.png";

const App = () => {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  };
  // const handleSend = () => {
  //   getMessages();
  //   setValue("");
  // };

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    let data;
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      const data = await response.json();
      setMessage(data.choices[0].message);
      // setValue("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(currentTitle, value, message);
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle]);
  console.log(previousChats);

  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );
  console.log(uniqueTitles);
  return (
    <div className='app bg'>
      <section className='left-side'>
        <button className='newChat' onClick={createNewChat}>
          <box-icon type='solid' color='white' name='plus-square'></box-icon>{" "}
          New Chat
        </button>
        <ul className='history'>
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav>
          <button className='elements'>
            <box-icon type='solid' color='white' name='home'></box-icon>
            Home
          </button>
          <button className='elements'>
            <box-icon name='bookmarks' type='solid' color='#ffffff'></box-icon>
            Bookmarks
          </button>
          <button className='elements'>
            <box-icon type='solid' color='white' name='rocket'></box-icon>
            Fly High
          </button>
        </nav>
      </section>

      <section className='mid'>
        {!currentTitle && (
          <div className='title'>
            <img src={Img1} alt='' />

            <h1>
              Leveling up today? <br />
              Let me know how I can help!
            </h1>
          </div>
        )}
        {!currentTitle && (
          <div className='ex'>
            <div className='row'>
              <button onClick={() => getMessages("How are you?")}>
                Plan a trip?
              </button>
              <button>Guess my age?</button>
            </div>
            <div className='row'>
              <button>Guess treking spots.</button>
              <button>Tell me about yourself.</button>
            </div>
          </div>
        )}
        <ul className='feed'>
          {currentChat?.map((chatMessage, index) => (
            <li key={index}>
              <p className='role'>
                {chatMessage.role === "user" ? (
                  <i className='fas fa-user'></i>
                ) : (
                  <i className='fas fa-robot'></i>
                )}
              </p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>{" "}
        <div className='bottom'>
          <div className='input-sec'>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Enter a prompt here'
            />
            <div id='submit' onClick={getMessages}>
              <box-icon name='send' type='solid' color='#ffffff'></box-icon>{" "}
            </div>
          </div>
          <p className='info'>
            AxiomAI is reliable but not flawless. Confirm important details
            independently.
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;
