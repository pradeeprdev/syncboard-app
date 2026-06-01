import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../store/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(loginUser(data));

      if (loginUser.fulfilled.match(res)) {
        toast.success("Login successful");
        navigate("/projects");
      } else {
        toast.error(res.payload || "Invalid email or password");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
          <section className="hidden bg-slate-950 p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <div className="inline-flex rounded-2xl bg-white/10 px-4 py-2 text-sm font-medium">
                SyncBoard
              </div>

              <h1 className="mt-8 text-4xl font-black leading-tight">
                Manage projects,
                <br />
                tasks and teams
                <br />
                in real time.
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">
                Secure login, role-based project access, live task updates,
                and collaborative workflow management.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-slate-300">
                Real-time collaboration powered by Socket.io.
              </p>
            </div>
          </section>

          <section className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <h2 className="text-3xl font-black text-slate-950">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Login to continue to your workspace.
              </p>

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-3.5 text-slate-400"
                    />

                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email address",
                        },
                      })}
                      type="email"
                      placeholder="you@example.com"
                      className={`w-full rounded-xl border px-4 py-3 pl-10 outline-none transition focus:ring-2 ${
                        errors.email
                          ? "border-red-300 focus:ring-red-200"
                          : "border-slate-200 focus:ring-slate-900"
                      }`}
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-700">
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-slate-600 hover:text-black"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-3.5 text-slate-400"
                    />

                    <input
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className={`w-full rounded-xl border px-4 py-3 pl-10 pr-11 outline-none transition focus:ring-2 ${
                        errors.password
                          ? "border-red-300 focus:ring-red-200"
                          : "border-slate-200 focus:ring-slate-900"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  disabled={loading || !isValid}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                New user?{" "}
                <Link
                  className="font-bold text-slate-950 hover:underline"
                  to="/register"
                >
                  Create account
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}