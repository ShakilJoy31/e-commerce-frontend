import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/images/icon/systech-bd-1761568143.png";

const HomeLoader = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing");
  
  const loadingMessages = [
    "Initializing",
    "Loading assets",
    "Setting up experience",
    "Almost ready",
    "Welcome!"
  ];

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Text animation
    let messageIndex = 0;
    const textInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[messageIndex]);
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0,
              }}
              animate={{
                y: [null, -30, 30, -20, 20, 0],
                x: [null, 20, -20, 30, -30, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Main loader container */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-8 px-4">
          {/* Logo with enhanced animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 0.6,
            }}
            className="relative"
          >
            {/* Glow effect behind logo */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Logo image */}
            <motion.img
              src={logo}
              alt="kry-home"
              className="relative w-full h-full object-cover z-10"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Animated rings around logo */}
          <div className="absolute">
            <motion.div
              className="absolute top-1/2 left-1/2 w-32 h-32 -mt-16 -ml-16 rounded-full border-2 border-purple-500/30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 0, 0.6],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 w-40 h-40 -mt-20 -ml-20 rounded-full border-2 border-pink-500/20"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0, 0.4],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Loading text */}
          <motion.div
            key={loadingText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <motion.p className="text-white/90 text-lg font-medium tracking-wide">
              {loadingText}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ...
              </motion.span>
            </motion.p>
          </motion.div>

          {/* Progress bar */}
          <div className="w-64 md:w-80">
            <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #a855f7, #ec4899, #a855f7)",
                  backgroundSize: "200% 100%",
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
            
            {/* Percentage */}
            <motion.div
              className="text-center mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-white/60 text-sm font-mono">
                {Math.floor(progress)}%
              </span>
            </motion.div>
          </div>

          {/* Subtle message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-white/40 text-xs text-center max-w-xs"
          >
            Crafting an exceptional experience for you
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HomeLoader;