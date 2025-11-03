import { useState } from "react";
import { Send, Sparkles, User, Bot } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

interface ChatMessage {
  type: "user" | "ai";
  text: string;
}

interface ChatResponse {
  response: string;
  error?: string;
}

const suggestedQuestions: string[] = [
  "What's my biggest expense category?",
  "How much did I spend this month?",
  "Give me tips to save money",
  "Analyze my spending patterns",
  "What's my average daily spending?",
];

export default function ChatWithAI() {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]); // Start empty
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);

  const handleAsk = async (question: string) => {
    if (!question.trim()) return;

    if (showSuggestions) setShowSuggestions(false);

    // Add user message
    setMessages((prev) => [...prev, { type: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post<ChatResponse>(
        "http://localhost:3000/api/chat",
        { question },
        { withCredentials: true }
      );

      if (data.error) throw new Error(data.error);

      // Add AI response
      setMessages((prev) => [...prev, { type: "ai", text: data.response }]);
    } catch (err: any) {
      console.error("Axios error:", err.response?.data ?? err.message);
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 pb-25 flex flex-col mx-12 justify-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-600 bg-clip-text text-transparent">
              AI Financial Assistant
            </h1>
            <p className="text-gray-500 text-sm">
              Ask me anything about your expenses
            </p>
          </div>
        </div>
      </motion.div>

      {/* Chat window */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 px-6 py-4 shadow-2xl mt-4">
        {/* Default AI greeting */}
        <div className="flex justify-start items-start gap-2">
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-500">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 rounded-2xl max-w-[80%] text-sm break-words bg-white text-gray-800 border border-gray-200"
          >
            👋 Hi! I'm your AI financial assistant. I can help you understand
            your spending habits, provide savings tips, and answer questions
            about your expenses. What would you like to know?
          </motion.div>
        </div>

        {/* Suggested questions */}
        {showSuggestions && (
          <div>
            <p className="text-sm text-gray-500 font-medium py-2">
              Try asking:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleAsk(q)}
                  className="bg-gray-100 hover:bg-blue-100 text-sm px-3 py-1 rounded-full transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* User & AI messages with white bubbles and gray border */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.type === "ai" && (
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-500">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm break-words bg-white border border-gray-200 ${
                msg.type === "user"
                  ? "text-blue-600 rounded-br-none"
                  : "text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </motion.div>

            {msg.type === "user" && (
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-blue-600">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* AI typing bubble */}
        {loading && (
          <div className="flex justify-start items-start gap-2">
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-500">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-2xl max-w-[50%] flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
            </motion.div>
          </div>
        )}

        {/* Input section at bottom */}
        <div className="mt-auto flex flex-row gap-2">
          <div className="flex items-center bg-[#f9f9fa] gap-2 border border-gray-200 rounded-md px-3 py-2 w-full">
            <input
              type="text"
              placeholder="Ask about your expenses..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 outline-none text-sm text-gray-950"
              onKeyDown={(e) => e.key === "Enter" && handleAsk(input)}
            />
          </div>
          <button
            onClick={() => handleAsk(input)}
            disabled={!input || loading}
            className={`px-4 rounded-md text-white transition ${
              loading
                ? "bg-gray-400"
                : "bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 shadow-md shadow-emerald-500/30"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
