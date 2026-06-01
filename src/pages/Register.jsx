import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../store/authSlice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const password = watch("password");

  const getPasswordStrength = () => {
    if (!password) return { label: "", width: "0%", color: "bg-slate-200" };

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) {
      return { label: "Weak", width: "33%", color: "bg-red-500" };
    }

    if (score <= 4) {
      return { label: "Medium", width: "66%", color: "bg-orange-500" };
    }

    return { label: "Strong", width: "100%", color: "bg-green-600" };
  };

  const strength = getPasswordStrength();

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(registerUser(data));

      if (registerUser.fulfilled.match(res)) {
        toast.success("Account created successfully");
        navigate("/projects");
      } else {
        toast.error(res.payload || "Registration failed");
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
                Start managing
                <br />
                projects with
                <br />
                your team.
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">
                Create projects, invite members, assign tasks, and collaborate
                in real time with role-based access.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xl font-bold">RBAC</p>
                <p className="mt-1 text-xs text-slate-300">Secure roles</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xl font-bold">Live</p>
                <p className="mt-1 text-xs text-slate-300">Socket sync</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xl font-bold">Fast</p>
                <p className="mt-1 text-xs text-slate-300">MERN stack</p>
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <h2 className="text-3xl font-black text-slate-950">
                Create account
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Join SyncBoard and start collaborating.
              </p>

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Full name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-3.5 text-slate-400"
                    />

                    <input
                      {...register("name", {
                        required: "Full name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                        maxLength: {
                          value: 40,
                          message: "Name is too long",
                        },
                      })}
                      placeholder="Your name"
                      className={`w-full rounded-xl border px-4 py-3 pl-10 outline-none transition focus:ring-2 ${
                        errors.name
                          ? "border-red-300 focus:ring-red-200"
                          : "border-slate-200 focus:ring-slate-900"
                      }`}
                    />
                  </div>

                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

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
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Password
                  </label>

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
                        validate: {
                          hasNumber: (value) =>
                            /\d/.test(value) ||
                            "Password should contain at least one number",
                        },
                      })}
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
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

                  {password && (
                    <div className="mt-2">
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all ${strength.color}`}
                          style={{ width: strength.width }}
                        />
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        Password strength:{" "}
                        <span className="font-semibold">{strength.label}</span>
                      </p>
                    </div>
                  )}

                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !isValid}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have account?{" "}
                <Link
                  className="font-bold text-slate-950 hover:underline"
                  to="/login"
                >
                  Login
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}