// import React, { useState } from "react";
// import axios from "axios";

// // Create an axios instance with a base URL
// const instance = axios.create({
//   baseURL: "https://teachapi.azurewebsites.net",
// });

// const Chat = () => {
//   const [input, setInput] = useState("");
//   const [response, setResponse] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const res = await instance.post(`/text_query/?query=${input}`);
//       setResponse(res.data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//       />
//       <button onClick={handleSubmit}>Send</button>
//       {loading ? <div>Loading...</div> : <div>{response}</div>}
//     </div>
//   );
// };

// export default Chat;
