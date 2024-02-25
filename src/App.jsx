import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
// import useClipboard from "react-use-clipboard";
import { useEffect, useRef, useState } from "react";
import "./App.css";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BsFillSendFill } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";

const API_KEY = "AIzaSyA8tRkKC8UCxF683P0y1nSBoN3jITMgUOI";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const SpeechRecognitionComponent = () => {
  const [typing, setTyping] = useState(false);
  const [newText, setNewText] = useState("");
  const [aiSpeaking, setAiSpeaking] = useState(false);

  const chatContainerRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Medha! Ask me anything!",
      sender: "ai",
    },
  ]);

  const navigateToVideos = () => {
    window.location.href = 'http://127.0.0.1:5000/';
  };


  const speakTranscript = (text) => {
    setAiSpeaking(true);
    console.log(text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setAiSpeaking(false);

    try {
      window.speechSynthesis.speak(utterance);
      console.log("speaking");
    } catch (error) {
      console.error("Error speaking:", error);
    }
  };

  const handleSend = async (message) => {
    if (!message) {
      return;
    }
    setNewText("");
    resetTranscript();

    // Update messages with the user message
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    //set typing indicator
    setTyping(true);

    try {
      const result = await model.generateContent(message);
      const text = result.response.text();

      // Check if the response is code before updating messages
      const isCode = text.includes("```");

      // Update messages with the AI response
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: text,
          sender: "ai",
          direction: "incoming",
          isCode, // Add a flag to identify code snippets
        },
      ]);

      setTyping(false);
      speakTranscript(text); // Speak the transcript text
    } catch (error) {
      setTyping(false);
      console.error("generateContent error: ", error);
    }
  };

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: false, language: "en-IN" });

  const {
    transcript,
    browserSupportsSpeechRecognition,
    resetTranscript,
    listening,
  } = useSpeechRecognition();

  // Listen for changes in the 'listening' variable
  useEffect(() => {
    // If the user is not speaking, stop listening and call handleSend with the transcript
    if (!listening) {
      handleSend(transcript);
    }
  }, [listening]);

  useEffect(() => {
    setNewText(transcript);
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ scrollBehavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="App ">
      <div>
        <h1 className="text-white">Medha!</h1>
        <div className="top_button">
          <button type="button">Learn</button>
          <button type="button" onClick={navigateToVideos}>Teach</button>
        </div>
        <div className="container">
          <div className="main_container ">
            <MainContainer>
              <ChatContainer>
                <MessageList
                  scrollBehavior="smooth"
                  typingIndicator={
                    typing ? (
                      <TypingIndicator content="Medha is typing" />
                    ) : null
                  }
                  className="bg-[#0D082C]"
                >
                  <div as={Message}>
                    {messages.map((message, i) => (
                      <Message
                        key={i}
                        model={message}
                      // Example inline styles
                      />
                    ))}
                    <div ref={chatContainerRef}></div>
                  </div>
                </MessageList>
              </ChatContainer>
            </MainContainer>

            <div className="input_container">
              <input
                type="text"
                placeholder="Enter your message"
                className="bg-[#0D082C] text-white"
                disabled={aiSpeaking}
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend(newText);
                  }
                }}
              />
              <div className="input-options">
                <FaMicrophone
                  className="mic"
                  onClick={startListening}
                  style={{ pointerEvents: aiSpeaking ? "none" : "auto" }}
                />

                <BsFillSendFill
                  className="send_button"
                  onClick={() => handleSend(newText)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechRecognitionComponent;
