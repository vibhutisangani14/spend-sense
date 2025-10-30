import React, { useState } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { askGemini } from "../services/geminiService";

type ChatMessage = {
  from: "user" | "bot";
  text: string;
  time: string;
};

const ChatPage: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const typeEffect = async (text: string) => {
    let typed = "";
    for (let i = 0; i < text.length; i++) {
      typed += text[i];
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = typed;
        return updated;
      });
      await new Promise((res) => setTimeout(res, 15));
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setHasStartedChat(true);
    setIsThinking(true);

    const userMsg: ChatMessage = {
      from: "user",
      text: message,
      time: getTime(),
    };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");

    const aiPlaceholder: ChatMessage = {
      from: "bot",
      text: "...",
      time: getTime(),
    };
    setChat((prev) => [...prev, aiPlaceholder]);

    try {
      const reply = await askGemini(message);
      setIsThinking(false);
      await typeEffect(reply);
    } catch {
      setIsThinking(false);
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text =
          "⚠️ Connection error. Please try again.";
        return updated;
      });
    }
  };

  const handleSuggestionClick = (text: string) => {
    setMessage(text);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-white flex justify-center px-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_0_45px_rgba(0,0,0,0.07)] border border-gray-100 flex flex-col p-10 mt-0">
        <div className="flex items-center gap-3 mb-6 sticky top-0 bg-white z-10 pb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
            <Bot className="w-6 h-6" />
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

        <div className="flex-1 overflow-y-auto rounded-2xl bg-white p-6 space-y-6 shadow-inner border border-gray-100 transition-all duration-500">
          {!hasStartedChat && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-sm">
                <Bot size={20} />
              </div>
              <div className="bg-white px-5 py-3 rounded-2xl text-[15px] text-gray-700 shadow-sm border border-gray-100 max-w-[80%] leading-relaxed">
                Hi! I'm your AI financial assistant. I can help you understand
                your spending habits, provide saving tips, and answer questions
                about your expenses. What would you like to know?
                <div className="text-xs text-gray-400 mt-1">{getTime()}</div>
              </div>
            </div>
          )}

          {chat.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.from === "user" ? "justify-end" : "items-start gap-4"
              }`}
            >
              {msg.from === "bot" && (
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-sm">
                  <Bot size={18} />
                </div>
              )}

              <div
                className={`px-5 py-3 rounded-2xl text-[15px] shadow-sm max-w-[75%] leading-relaxed transition-all ${
                  msg.from === "user"
                    ? "bg-[linear-gradient(135deg,#6366f1,#8b5cf6)] text-white"
                    : "bg-white border border-gray-100 text-gray-700"
                }`}
              >
                {msg.text}
                <div
                  className={`text-xs mt-1 ${
                    msg.from === "user" ? "text-indigo-100" : "text-gray-400"
                  }`}
                >
                  {msg.time}
                </div>
              </div>

              {msg.from === "user" && (
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-sm ml-3">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-3 text-gray-500 ml-12">
              <Loader2 className="animate-spin w-4 h-4" />
              <span>Thinking...</span>
            </div>
          )}

          {!hasStartedChat && (
            <div className="ml-14 space-y-3 fade-in">
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
          )}
        </div>

        <form
          onSubmit={handleSend}
          className="mt-5 flex items-center gap-3 border border-gray-200 rounded-full px-5 py-2.5 shadow-sm bg-white sticky bottom-4"
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
