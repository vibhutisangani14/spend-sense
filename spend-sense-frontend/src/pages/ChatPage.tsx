import React, { useState } from "react";
import { Send, Wallet } from "lucide-react";

const ChatPage: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ from: "user" | "bot"; text: string }[]>(
    []
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setChat((prev) => [...prev, { from: "user", text: message }]);
    setMessage("");
    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        {
          from: "bot",
          text: "This is a sample AI response. Answer: ",
        },
      ]);
    }, 1000);
  };

  // Smoothly fill input when a suggestion is clicked
  const handleSuggestionClick = (text: string) => {
    let i = 0;
    setMessage("");
    const interval = setInterval(() => {
      if (i < text.length) {
        setMessage(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 25); // typing animation speed
  };

  return (
    <div className="flex justify-center items-center h-full bg-white p-10">
      <div className="w-full  h-head max-w-5xl bg-white rounded-3xl shadow-[0_0_45px_rgba(0,0,0,0.07)] border border-gray-100 flex flex-col p-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white shadow-md">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              AI Financial Assistant
            </h1>
            <p className="text-gray-500 text-sm">
              Ask me anything about your expenses
            </p>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto rounded-2xl bg-white p-6 space-y-6 shadow-inner border border-gray-100">
          {/* Initial message */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-sm">
              <Wallet size={20} />
            </div>
            <div className="bg-white px-5 py-3 rounded-2xl text-[15px] text-gray-700 shadow-sm border border-gray-100 max-w-[80%] leading-relaxed">
              Hi! I'm your AI financial assistant. I can help you understand
              your spending habits, provide savings tips, and answer your
              questions about expenses. What would you like to know?
            </div>
          </div>

          {/* Chat messages */}
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.from === "user" ? "justify-end" : "items-start gap-4"
              }`}
            >
              {msg.from === "bot" && (
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-sm">
                  <Wallet size={18} />
                </div>
              )}
              <div
                className={`px-5 py-3 rounded-2xl text-[15px] shadow-sm max-w-[75%] leading-relaxed ${
                  msg.from === "user"
                    ? "bg-[linear-gradient(135deg,#6366f1,#8b5cf6)] text-white"
                    : "bg-white border border-gray-100 text-gray-700"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Suggestions */}
          <div className="ml-14 space-y-3">
            <p className="text-gray-600 font-medium">Try asking:</p>
            <div className="flex flex-wrap gap-3">
              {[
                "What's my biggest expense category?",
                "How much did I spend this month?",
                "Give me tips to save money",
                "Analyze my spending patterns",
                "What's my average daily spending?",
              ].map((text, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(text)}
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-full bg-white cursor-pointer 
                             hover:text-white hover:bg-[linear-gradient(135deg,#6366f1,#8b5cf6)] 
                             hover:border-transparent transition-all duration-300"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="mt-5 flex items-center gap-3 border border-gray-200 rounded-full px-5 py-2.5 shadow-sm bg-white"
        >
          <input
            type="text"
            placeholder="Ask about your expenses..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 text-base text-gray-700 placeholder-gray-400 outline-none"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white p-3 rounded-full hover:scale-105 transition-transform shadow-md"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
