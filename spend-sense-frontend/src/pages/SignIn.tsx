import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/auth";
import LoginImg from "../images/login.png";

type SignInForm = {
  email: string;
  password: string;
  remember: boolean;
  showPassword: boolean;
};

export default function SignIn() {
  const [form, setForm] = useState<SignInForm>({
    email: "",
    password: "",
    remember: false,
    showPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const onChange =
    (k: keyof SignInForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const v =
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setForm((s) => ({ ...s, [k]: v as never }));
    };

  const toggleShowPassword = () =>
    setForm((s) => ({ ...s, showPassword: !s.showPassword }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await login(form.email, form.password);

      if (res?.token) {
        if (form.remember) {
          localStorage.setItem("token", res.token);
        } else {
          sessionStorage.setItem("token", res.token);
        }
      }

      nav("/app");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f3f8] px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="relative hidden md:block bg-gradient-to-b from-[#efeafd] to-[#f6f5ff] p-14">
          <img
            src={LoginImg}
            alt="Illustration"
            className="w-full h-auto object-contain rounded-2xl"
          />
        </div>

        <div className="p-8 md:p-10">
          <div className="flex items-center justify-end mb-6">
            <div className="text-sm text-gray-500">
              Don’t have an account?{" "}
              <Link to="/signUp" className="text-purple-600 hover:underline">
                Sign up
              </Link>
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Sign in</h1>
          <p className="text-sm text-gray-500 mb-8">
            Welcome back to SpendSense.
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="email@example.com"
                value={form.email}
                onChange={onChange("email")}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={form.showPassword ? "text" : "password"}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Your password"
                  value={form.password}
                  onChange={onChange("password")}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  aria-label={
                    form.showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {form.showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={onChange("remember")}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                Remember me
              </label>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 text-sm font-medium shadow hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/60 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
