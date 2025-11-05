import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as signup } from "../services/auth";
import RegisterImg from "../images/register.png";

type SignUpForm = {
  name: string;
  email: string;
  password: string;
  confirm: string;
  remember: boolean;
};

export default function SignUp() {
  const [form, setForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
    confirm: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  const onChange =
    (k: keyof SignUpForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const v =
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setForm((s) => ({ ...s, [k]: v as never }));
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await signup(form.name, form.email, form.password);
      nav("/");
    } catch {
      setError("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f3f8] px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="relative hidden md:block bg-gradient-to-b from-[#efeafd] to-[#f6f5ff]">
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <img
              src={RegisterImg}
              alt="Illustration"
              className="w-full h-auto object-contain rounded-2xl"
            />
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="flex items-center justify-end mb-6">
            <div className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/signIn" className="text-purple-600 hover:underline">
                Sign in
              </Link>
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Create account
          </h1>
          <p className="text-sm text-gray-500 mb-8">Sign up to SpendSense.</p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Full name"
                value={form.name}
                onChange={onChange("name")}
                autoComplete="name"
              />
            </div>

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
              <input
                type="password"
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={onChange("password")}
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <input
                type="password"
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Re-enter your password"
                value={form.confirm}
                onChange={onChange("confirm")}
                autoComplete="new-password"
              />
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
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
