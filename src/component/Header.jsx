import React from 'react'
const Header = ({
    navigateToVideos,
    language,
    handleLanguageChange,
    classNumber,
    handleClassChange,
    subject,
    handleSubjectChange,
  }) => {
    return(
    <>
      <div className="header">
          <div className="header-first">
            <div>
              <h6>Conversation</h6>
              <p>
                This is private message, between you and budddy. this chat is
                end to end encrypted
              </p>
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
          <div className="header-second">
            <div className="bot-medha">
              <div className="bot-img">
                <img src="/Character 19.png" alt="" className="img-robot" />
              </div>
              <h1 className="medha-heading">Medha</h1>
            </div>
            <div
              className="top_button"
              style={{ display: "flex", gap: "10px", alignItems: "center" }}
            >
              <select
                value={language}
                onChange={handleLanguageChange}
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value="">Select Language</option>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="hinglish">Hinglish</option>
              </select>

              <select
                id="class"
                value={classNumber}
                onChange={handleClassChange}
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value="">Select Class</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>

              <select
                value={subject}
                onChange={handleSubjectChange}
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value="">Select Subject</option>
                <option value="english">English</option>
                <option value="social-science">Social Science</option>
                <option value="science">Science</option>
              </select>
            </div>
          </div>
        </div> 
    </>
  )
}

export default Header
