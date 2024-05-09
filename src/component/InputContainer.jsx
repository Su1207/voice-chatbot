import React, { useState } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { BsFillSendFill } from "react-icons/bs";

const InputContainer = ({
  newText,
  setNewText,
  aiSpeaking,
  startListening,
  handleSend,
  stopSpeaking,
  src,
}) => {
  return (
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
  );
};

export default InputContainer;
