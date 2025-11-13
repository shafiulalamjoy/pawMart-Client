import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";

export default function SignIn() {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if already signed in, redirect
    if (auth.currentUser) navigate(redirectTo, { replace: true });
  }, [auth, navigate, redirectTo]);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Signed in");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Signed in with Google");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Google sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="mt-1 block w-full border rounded px-3 py-2"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="mt-1 block w-full border rounded px-3 py-2"
            placeholder="Your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="text-center">or</div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full border px-4 py-2 rounded flex items-center justify-center gap-2"
        >
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="google" className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="text-sm text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
