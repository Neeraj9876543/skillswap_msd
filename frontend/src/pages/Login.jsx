import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, BookOpen } from "lucide-react";
import Swal from "sweetalert2";
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("skillSwapToken", data.token);
        localStorage.setItem("skillSwapUser", JSON.stringify(data.user));
        Swal.fire("Login successful!");
        navigate("/", { replace: true });
      } else {
        Swal.fire(data.message || "Invalid email or password.");
      }
    } catch (error) {
      Swal.fire("An error occurred. Please try again.");
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 via-rose-50 to-white flex items-center justify-center px-4">
      <div className="flex bg-white shadow-xl rounded-2xl border border-rose-100 max-w-4xl w-full overflow-hidden">
        <div className="hidden md:block md:w-1/2 bg-rose-50">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"
            alt="Login illustration"
            className="w-full h-full object-cover"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full md:w-1/2 p-8 "
        >
          <motion.h2
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold text-center text-gray-800 mb-6"
          >
            Welcome Back to{" "}
            <span className="bg-gradient-to-r from-orange-500 via-indigo-500 to-green-500 text-transparent bg-clip-text">
              SkillSwap
            </span>
          </motion.h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-rose-200"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-rose-200"
                  required
                />
              </div>
              <motion.div
                className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-rose-500"
                onClick={() => setShowPassword(!showPassword)}
                animate={{ rotateY: showPassword ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <BookOpen size={20} />
              </motion.div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:from-rose-600 hover:to-pink-600 transition"
            >
              Log In
            </motion.button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-rose-500 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
export default Login;
