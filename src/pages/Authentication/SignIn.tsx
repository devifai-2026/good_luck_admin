import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaLock } from "react-icons/fa";

const SignIn = () => {
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPremiumLock, setShowPremiumLock] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "devifai.goodluck@gmail.com" && password === "123456") {
      localStorage.setItem("user", JSON.stringify({ email }));
      toast.success("Login successful!");
      navigate("/");
    } else {
      toast.error("Invalid email or password");
    }
  };

  const handleOtpClick = () => {
    setShowPremiumLock(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-200 via-white to-orange-300 px-4 relative">
      {/* Premium Lock Overlay */}
      {showPremiumLock && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-lg">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl p-8 max-w-md text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full">
                <FaLock className="text-white text-4xl" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Premium Feature Locked
            </h3>
            
            <p className="text-gray-600 mb-6">
              OTP authentication is a premium feature. Please contact our developer team to unlock this functionality.
            </p>
            
            <div className="flex flex-col space-y-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-medium"
                onClick={() => {
                  window.location.href = "mailto:support@devifai.com";
                }}
              >
                Contact Developer Team
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium"
                onClick={() => setShowPremiumLock(false)}
              >
                Go Back
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col md:flex-row w-full max-w-4xl shadow-xl rounded-xl overflow-hidden bg-white/70 backdrop-blur-md"
      >
        {/* Left Side: Image Section */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hidden md:flex flex-1 bg-orange-300 justify-center items-center"
        >
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-white mb-4">Welcome Back!</h1>
            <p className="text-white/90">Sign in to access your dashboard</p>
          </div>
        </motion.div>

        {/* Right Side: Sign-In Form */}
        <div className="flex-1 p-8 border-2 border-orange-300 rounded-r-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            {isOtpMode ? "Sign In with OTP" : "Sign In"}
          </h2>

          {!isOtpMode ? (
            <motion.form 
              onSubmit={handleSignIn}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 p-3 border border-orange-400 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-800">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 p-3 border border-orange-400 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-all"
              >
                Sign In
              </motion.button>
            </motion.form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-8"
            >
              <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-6">
                <p>OTP authentication is currently locked</p>
              </div>
              <button
                onClick={handleOtpClick}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
              >
                <FaLock /> Unlock OTP Feature
              </button>
            </motion.div>
          )}

          <p className="mt-4 text-center text-sm text-gray-700">
            {isOtpMode ? "Want to sign in with password?" : "Sign in with OTP instead?"}{" "}
            <button
              className="text-orange-500 hover:underline transition-all"
              onClick={() => setIsOtpMode(!isOtpMode)}
            >
              {isOtpMode ? "Use Password" : "Use OTP"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;