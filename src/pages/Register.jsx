import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import toast from "react-hot-toast";

const PASSWORD_REGEX = /(?=.*[a-z])(?=.*[A-Z]).{6,}/;

export default function Register() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!PASSWORD_REGEX.test(password)) {
      toast.error("Password must have 1 uppercase, 1 lowercase and at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, {
        displayName: name || undefined,
        photoURL: photoURL || undefined
      });
      toast.success("Registered successfully");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Registered with Google");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Google registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow text-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Register</h2>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-blue-700">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 
          focus:border-blue-600 focus:ring-blue-600 text-gray-900"
            placeholder="Full name"
          />
        </div>

        {/* Photo URL */}
        <div>
          <label className="block text-sm font-medium text-blue-700">Photo URL</label>
          <input
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 
          focus:border-blue-600 focus:ring-blue-600 text-gray-900"
            placeholder="https://..."
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-blue-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 
          focus:border-blue-600 focus:ring-blue-600 text-gray-900"
            placeholder="you@example.com"
          />
        </div>

        {/* Password with Toggle */}
        <div>
          <label className="block text-sm font-medium text-blue-700">Password</label>

          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPass ? "text" : "password"}
              required
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 
              pr-10 focus:border-blue-600 focus:ring-blue-600 text-gray-900"
              placeholder="Choose a password"
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            At least 1 uppercase, 1 lowercase, minimum 6 characters
          </p>

          {/* Forgot Password */}
          <button
            type="button"
            onClick={handleResetPassword}
            className="text-blue-600 hover:underline text-xs mt-1"
          >
            Forgot password?
          </button>
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="text-center text-gray-600">or</div>

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full border border-gray-300 px-4 py-2 rounded flex items-center 
        justify-center gap-2 hover:bg-gray-100 transition text-gray-700"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Already Have an Account */}
        <p className="text-sm text-center text-gray-700">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

