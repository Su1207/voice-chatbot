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
import Header from "./component/Header";
import InputContainer from "./component/InputContainer";
import AudioPlayer from "./component/AudioPlayer";

// const API_KEY = "AIzaSyA8tRkKC8UCxF683P0y1nSBoN3jITMgUOI";
// const genAI = new GoogleGenerativeAI(API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const SpeechRecognitionComponent = () => {
  const [typing, setTyping] = useState(false);
  const [newText, setNewText] = useState("");
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [src, setSrc] = useState();
  const [language, setLanguage] = useState("English");
  const [classNumber, setClassNumber] = useState("6");
  const [subject, setSubject] = useState("English");
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleClassChange = (e) => {
    setClassNumber(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

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
      // audioElement.play();
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

    setNewText("");
    resetTranscript();

    // Update messages with the user's message
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    setTyping(true);

    try {
      // Construct the API URL with query parameters
      const apiUrl = `https://medha-cograd.azurewebsites.net/text_query/?query=${message}&language=${language}&class_num=${classNumber}&subject=${subject}`;

      const response = await axios.post(apiUrl);

      console.log(response.data);

      const text = response.data;

      // Play the response text with a female voice
      await speakTextWithFemaleVoice(text);

      const isCode = text.includes("```");

      // Update messages with the AI's response
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: text,
          sender: "ai",
          direction: "incoming",
          isCode,
        },
      ]);

      setTyping(false);
    } catch (error) {
      setTyping(false);
      console.error("Error while sending message:", error);
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
        <Header
          navigateToVideos={navigateToVideos}
          language={language}
          handleLanguageChange={handleLanguageChange}
          classNumber={classNumber}
          handleClassChange={handleClassChange}
          subject={subject}
          handleSubjectChange={handleSubjectChange}
        />
        {/* <AudioPlayer audioUrl={src}/> */}
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

            <InputContainer
              newText={newText}
              setNewText={setNewText}
              aiSpeaking={aiSpeaking}
              startListening={startListening}
              handleSend={handleSend}
              stopSpeaking={stopSpeaking}
              src={src}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechRecognitionComponent;
