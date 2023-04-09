import React, { useEffect, useRef } from 'react';
import './SlideText.css';

function SlideText(props) {
  const messages = props.messages || 
    ["Este es un mensaje de testeo",
     "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
     "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s", 
     "Increible"
    ];
    
  const messagesRef = useRef(null);

  useEffect(() => {
    let concatenatedMessages = '';
    messages.forEach((message, index) => {
      concatenatedMessages += message + (index !== messages.length - 1 ? '<span>|</span>' : '');
    });
    concatenatedMessages = ' ' + concatenatedMessages;
    messagesRef.current.innerHTML = concatenatedMessages;
    const duration = concatenatedMessages.length / 4 ;
    messagesRef.current.style.animationDuration = duration + 's';
  }, [messages]);

  return (
    <div className="slide-text-container">
      <div className="slide-text" ref={messagesRef}></div>
    </div>
  );
}

export default SlideText;
