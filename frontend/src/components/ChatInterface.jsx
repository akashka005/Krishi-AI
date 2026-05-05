import { motion } from 'framer-motion';
import { ShieldCheck, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import NeuralAvatar from './NeuralAvatar';

export default function ChatInterface({ messages = [], isTyping }) {

  const MessageBubble = ({ msg }) => {
    const isAi = msg.role === 'ai';

    return (
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'} mb-8`}
      >
        <div className={`flex gap-3 max-w-[90%] sm:max-w-[85%] ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
          {isAi ? (
            <NeuralAvatar />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-earth-800 text-white">
              <User className="w-5 h-5" />
            </div>
          )}

          <div className={`rounded-2xl p-5 ${isAi ? 'glass-card' : 'bg-earth-800 text-white shadow-xl'}`}>
            {isAi ? (
              <div className="prose-earth max-w-none prose-sm sm:prose-base leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content || ''}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="leading-relaxed text-sm sm:text-base font-medium">{msg.content}</p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full px-2 sm:px-6 py-4">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: [1, 1.05, 1],
              y: [0, -10, 0]
            }}
            transition={{
              opacity: { duration: 1 },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-24 h-24 bg-white/50 backdrop-blur-md rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl neural-border relative group"
          >
            <motion.span
              className="text-5xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🌱
            </motion.span>

            <motion.div
              className="absolute inset-0 border-2 border-primary-400/30 rounded-[2rem]"
              animate={{ scale: [1, 1.25], opacity: [0.5, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          </motion.div>
          <h3 className="text-2xl font-bold text-earth-800 mb-3 font-heading">Welcome to KRISHI AI</h3>
          <p className="text-earth-500 max-w-sm font-medium">Your intelligent agricultural partner. Ask me anything about your crops, weather, or soil health.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} msg={msg} />
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start mb-8 ml-11"
            >
              <div className="glass-card px-4 py-3 rounded-2xl flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-primary-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}