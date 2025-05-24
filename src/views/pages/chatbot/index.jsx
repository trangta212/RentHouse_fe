import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, CheckCheck } from "lucide-react";
import { sendQueryToLLM } from "../../../api/chatbotApi"; // Import hàm từ api.js
import poor from "../../../assets/images/poor.png";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"

export default function ChatBotPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text:
        "Chào bạn! Mình là trợ lý HomeNest 🏠. Bạn muốn tìm phòng trọ như thế nào?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const newMsg = {
      from: "user",
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const data = await sendQueryToLLM(newMsg.text); // Gọi API từ api.js
      const { response: botResponse } = data;
      const botMsg = {
        from: "bot",
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: true,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = {
        from: "bot",
        text: error.message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
       <button
       onClick={() => setIsOpen(true)}
       className="flex items-center justify-center rounded-full p-3 bg-pink-300 text-white shadow-lg"
     >
       <img src={poor} alt="Chat Icon" className="w-12 h-12" />
     </button>     
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-[430px] bg-white h-[600px] rounded-2xl shadow-xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-pink-300 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3 font-semibold text-lg">
              {/* <Bot className="w-5 h-5" /> */}
              <img
                src={poor}  // đường dẫn tới ảnh của bạn
                alt="Bot icon"
                className="w-7 h-7"
                />
              <span>Trợ lý HomeNest</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xl font-bold hover:opacity-80"
            >
              -
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-4 max-h-[450px] overflow-y-auto bg-gray-50 flex-1">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.from === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-xl text-sm max-w-[75%] ${
                    msg.from === "user" ? "bg-gray-200" : "bg-green-100"
                  }`}
                >
                  {/* {msg.text} */}
                  {msg.from === "bot" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                    ) : (
                    msg.text
                    )}
                </div>
                <div className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                  <span>{msg.time}</span>
                  {msg.read && <CheckCheck className="w-4 h-4 text-purple-500" />}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start">
                <div className="px-4 py-2 rounded-xl text-sm max-w-[75%] bg-green-100">
                  Đang xử lý...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-3 bg-white">
            <div className="flex gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Nhập câu hỏi bạn muốn hỏi"
                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                className={`px-4 py-2 rounded-full text-sm text-white ${
                  isLoading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={isLoading}
              >
                Gửi
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
