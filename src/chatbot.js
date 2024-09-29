import { useState } from 'react';
import axios from "axios";

const ChatBox = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  
  const getGeminiResponse = async (message) => {
    const apiUrl = ""; // Update this to the real Gemini API endpoint
    const apiKey = "lol"; // Your provided API key
    
    try {
      const response = await axios.post(
        apiUrl,
        { message },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`, 
          },
        }
      );
      return response.data.reply;
    } catch (error) {
      console.error("Error fetching Gemini API response:", error);
      return "Sorry, I couldn't process that.";
    }
  };

  const handleSendMessage = async () => {
    if (!userInput) return;

    const newChat = { sender: "user", message: userInput };
    setChatHistory([...chatHistory, newChat]);

    const geminiReply = await getGeminiResponse(userInput);
    const botReply = { sender: "gemini", message: geminiReply };
    setChatHistory([...chatHistory, newChat, botReply]);

    setUserInput("");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} h-screen flex flex-col items-center justify-center`}>
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="h-80 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"} mb-2`}
            >
              <div
                className={`p-2 rounded-lg ${
                  chat.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-600 dark:text-white text-black"
                }`}
              >
                {chat.message}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            className="w-full mt-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
