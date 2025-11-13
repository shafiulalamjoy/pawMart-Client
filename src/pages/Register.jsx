import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";

const PASSWORD_REGEX = /(?=.*[a-z])(?=.*[A-Z]).{6,}/; // 1 lower, 1 upper, min 6

export default function Register() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      // set display name and photoURL
      await updateProfile(userCred.user, { displayName: name || undefined, photoURL: photoURL || undefined });
      toast.success("Registered successfully");
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
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
      console.error(err);
      toast.error(err.message || "Google registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" placeholder="Full name" />
        </div>

        <div>
          <label className="block text-sm font-medium">Photo URL</label>
          <input value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" placeholder="https://..." />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-1 block w-full border rounded px-3 py-2" placeholder="you@example.com" />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="mt-1 block w-full border rounded px-3 py-2" placeholder="Choose a password" />
          <p className="text-xs text-gray-500 mt-1">At least 1 uppercase, 1 lowercase, minimum 6 characters</p>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="text-center">or</div>

        <button type="button" onClick={handleGoogle} disabled={loading} className="w-full border px-4 py-2 rounded flex items-center justify-center gap-2">
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="google" className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
