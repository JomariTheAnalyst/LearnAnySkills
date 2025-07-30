'use client';

import { motion } from 'framer-motion';

export default function HeroIllustration() {
  return (
    <div className="relative h-full flex items-center justify-center">
      {/* Floating geometric shapes */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl shadow-lg"
      />
      
      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-1/2 right-1/4 w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full shadow-lg"
      />
      
      <motion.div
        animate={{
          y: [0, -10, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg shadow-lg"
      />
      
      {/* Central illustration */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10"
      >
        <div className="w-64 h-64 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center shadow-xl">
          <div className="w-48 h-48 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 relative"
            >
              <div className="absolute inset-0 bg-white rounded-full opacity-20"></div>
              <div className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full opacity-80"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-white rounded-full opacity-60"></div>
              <div className="absolute top-1/2 right-2 w-3 h-3 bg-white rounded-full opacity-40"></div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Floating elements around */}
      <motion.div
        animate={{
          y: [0, -30, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-16 right-16 w-8 h-8 bg-accent-400 rounded-full opacity-60"
      />
      
      <motion.div
        animate={{
          y: [0, 25, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute bottom-16 left-16 w-6 h-6 bg-primary-400 rounded-full opacity-70"
      />
    </div>
  );
}