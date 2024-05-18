import "regenerator-runtime/runtime";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useEffect, useRef, useState } from "react";
import "./App.css";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { BsFillSendFill } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";
import Header from "./component/Header";
import InputContainer from "./component/InputContainer";
import AudioPlayer from "./component/AudioPlayer";

const SpeechRecognitionComponent = () => {
  const [typing, setTyping] = useState(false);
  const [newText, setNewText] = useState("");
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [src, setSrc] = useState();
  const [language, setLanguage] = useState("English");
  const [classNumber, setClassNumber] = useState("6");
  const [subject, setSubject] = useState("English");
  const [isLatestMessageFromAI, setIsLatestMessageFromAI] = useState(false);

  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handleClassChange = (e) => setClassNumber(e.target.value);
  const handleSubjectChange = (e) => setSubject(e.target.value);

  const lastMessageRef = useRef(null);

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
        { text }
      );

      audioElement.src = response.data.audioUrl;
      setSrc(response.data.audioUrl);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const stopSpeaking = (audioUrl) => {
    audioElement.src = audioUrl;
    audioElement.pause();
    setAiSpeaking(false);
  };

  const handleSend = async (message) => {
    if (!message) return;

    setNewText("");
    resetTranscript();

    const newMessage = { message, direction: "outgoing", sender: "user" };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);

    try {
      const apiUrl = `https://medha-cograd.azurewebsites.net/text_query/?query=${message}&language=${language}&class_num=${classNumber}&subject=${subject}`;
      const response = await axios.post(apiUrl);

      const text = response.data;
      await speakTextWithFemaleVoice(text);

      const isCode = text.includes("```");
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: text, sender: "ai", direction: "incoming", isCode },
      ]);

      setIsLatestMessageFromAI(true); // Set flag to true when AI responds
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

  useEffect(() => {
    if (!listening) {
      handleSend(transcript);
    }
  }, [listening]);

  useEffect(() => {
    setNewText(transcript);
  }, [transcript]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div className="App">
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
        <div className="container">
          <div className="main_container">
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
                  {messages.map((message, i) => (
                    <div
                      key={i}
                      ref={i === messages.length - 1 ? lastMessageRef : null}
                    >
                      <Message model={message} />
                      {isLatestMessageFromAI &&
                        i === messages.length - 1 &&
                        typing.content !== "Medha is typing" && (
                          <AudioPlayer audioUrl={src} />
                        )}
                    </div>
                  ))}
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
