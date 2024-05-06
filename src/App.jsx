import "regenerator-runtime/runtime";
import axios from "axios";
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
// import { GoogleGenerativeAI } from "@google/generative-ai";
import { BsFillSendFill } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";

// const API_KEY = "AIzaSyA8tRkKC8UCxF683P0y1nSBoN3jITMgUOI";
// const genAI = new GoogleGenerativeAI(API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const SpeechRecognitionComponent = () => {
  const [typing, setTyping] = useState(false);
  const [newText, setNewText] = useState("");
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [src, setSrc] = useState();

  const chatContainerRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Medha! Ask me anything!",
      sender: "ai",
    },
  ]);

  const navigateToVideos = () => {
    window.location.href = "http://127.0.0.1:5000/";
  };

  const audioElement = new Audio();

  const speakTextWithFemaleVoice = async (text) => {
    try {
      const response = await axios.post(
        "https://voicebot-server.onrender.com/generate-speech",
        {
          text: text,
        }
      );

      // Run this part of code after 3 seconds
      audioElement.src = response.data.audioUrl;
      setSrc(response.data.audioUrl);
      audioElement.play();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to stop speech
  const stopSpeaking = (audioUrl) => {
    console.log(audioUrl);
    audioElement.src = audioUrl;
    audioElement.pause();
    setAiSpeaking(false);
  };

  const handleSend = async (message) => {
    if (!message) {
      return;
    }

    // deleteFile("../voice-chatbot/public/audio.mp3");
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
      const apiUrl = `https://medha-cograd.azurewebsites.net/text_query/?query=${message}`;
      const response = await axios.post(apiUrl);

      console.log(response.data); // Assuming your API returns a 'response' field
      const text = response.data;

      await speakTextWithFemaleVoice(text); // Speak the transcript text

      // Check if the response is code before updating messages
      const isCode = text.includes("```");

      // Update messages with the AI respon
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
      <div className="above">
        <div className="header">
          <div className="header-first">
            <h6>Conversation</h6>
            <p>
              This is private message, between you and budddy. this chat is end
              to end encrypted...
            </p>
          </div>
          <div className="header-second">
            <div className="bot-medha">
              <div className="bot-img">
                <img src="/Character 19.png" alt="" className="img-robot" />
              </div>
              <h1 className="medha-heading">Medha</h1>
            </div>
            <div className="top_button">
              <button type="button " className="learn">
                {" "}
                Learn
              </button>
              <button
                type="button"
                className="teach"
                onClick={navigateToVideos}
              >
                Teach
              </button>
            </div>
          </div>
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

                <FaMicrophoneSlash
                  className="mic-off"
                  onClick={() => stopSpeaking(src)}
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