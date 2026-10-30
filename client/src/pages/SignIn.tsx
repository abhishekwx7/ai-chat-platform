import { useState, type SubmitEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authClient } from "../auth-client";

function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setError("");
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Invalid email or password");
        return;
      }

      navigate("/chat", { replace: true });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#191C22] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-xl border border-gray-700 bg-[#23262E] p-8"
      >
        <h1 className="text-center text-3xl font-bold text-white">
          Welcome Back
        </h1>

        <p className="text-center text-sm text-gray-400">
          Sign in to your AI Chat Platform
        </p>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-lg border border-gray-600 bg-[#191C22] p-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm text-gray-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-gray-600 bg-[#191C22] p-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-400 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
