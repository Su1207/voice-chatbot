import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import { useState } from "react";
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

  const [messages, setMessages] = useState([
    {
      message: "Hello,I'm Suraj",
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

  console.log(messages);

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });

  const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div className="App container">
      <div style={{ width: "700px", height: "80vh" }}>
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
            <MessageInput
              placeholder="Enter your message"
              value={transcript}
              onSend={handleSend}
            />
          </ChatContainer>
        </MainContainer>
      </div>
      <div className="btn-style">
        <button style={{ background: "#000" }} onClick={startListening}>
          Start Listening
        </button>
        <button
          style={{ background: "#000" }}
          onClick={SpeechRecognition.stopListening}
        >
          Stop Listening
        </button>
        <button style={{ background: "#000" }} onClick={resetTranscript}>
          Reset
        </button>
        <button
          style={{ background: "#000" }}
          onClick={() => handleSend(transcript)}
        >
          Send Transcript
        </button>
      </div>
    </div>
  );
};

export default SpeechRecognitionComponent;
