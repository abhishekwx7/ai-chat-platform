import { useState, type SubmitEvent } from "react";
import { authClient } from "../auth-client";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        setError(error.message || "Failed to create account!");
        return;
      }

      console.log("Account Created: ", data);
    } catch {
      setError("Something went wrong! Please try again.");
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
        <h1 className="text-3xl text-center font-bold text-white">
          Create Account
        </h1>

        <div>
          <label htmlFor="name" className="mb-2 block text-sm text-gray-300">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="w-full rounded-lg border border-gray-600 bg-[#191C22] p-3 text-white"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-lg border border-gray-600 bg-[#191C22] p-3 text-white"
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
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-lg border border-gray-600 bg-[#191C22] p-3 text-white"
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
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold
           text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Create Account" : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default SignUp;
