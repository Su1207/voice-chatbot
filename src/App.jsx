import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import { useEffect, useState } from "react";
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
import { FaMicrophoneSlash } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";

const API_KEY = "AIzaSyA8tRkKC8UCxF683P0y1nSBoN3jITMgUOI";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
// const systemMessage = {
//   //  Explain things like you're talking to a software professional with 5 years of experience.
//   role: "system",
//   content:
//     "Explain things like you're talking to a software professional with 2 years of experience.",
// };

const SpeechRecognitionComponent = () => {
  const [typing, setTyping] = useState(false);
  const [newText, setNewText] = useState("");

  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Medha! Ask me anything!",
      sender: "ai",
    },
  ]);

  const handleSend = async (message) => {
    if (!message) {
      return;
    }
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
          isCode, // Add a flag to identify code snippets
        },
      ]);

      setTyping(false);
    } catch (error) {
      setTyping(false);
      console.error("generateContent error: ", error);
    }
  };

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });

  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition();

  useEffect(() => {
    setNewText(transcript);
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div className="App">
      <div>
        <h1>Medha!</h1>
        <div className="container">
          <div className="main_container">
            <MainContainer>
              <ChatContainer>
                <MessageList
                  scrollBehavior="smooth"
                  typingIndicator={
                    typing ? <TypingIndicator content="Typing" /> : null
                  }
                >
                  {messages.map((message, i) => {
                    return <Message key={i} model={message} />;
                  })}
                </MessageList>
              </ChatContainer>
            </MainContainer>

            {/* <div className="border-top"></div> */}
            <div className="input_container" as={MessageInput}>
              <input
                type="text"
                placeholder="Enter your message"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend(newText);
                  }
                }}
              />
              <BsFillSendFill
                className="send_button"
                onClick={() => handleSend(newText)}
              />
            </div>
          </div>

          <div className="btn-style">
            <div className="mic-div" onClick={startListening}>
              <FaMicrophone className="mic" />
            </div>
            <div
              className="mic-off-div"
              onClick={SpeechRecognition.stopListening}
            >
              <FaMicrophoneSlash className="mic-off" />
            </div>
            <div className="reset-div" onClick={resetTranscript}>
              <GrPowerReset className="reset" />
            </div>
            {/* <button onClick={() => handleSend(transcript)}>Send</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechRecognitionComponent;
