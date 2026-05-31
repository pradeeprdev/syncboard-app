import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const res = await dispatch(loginUser(data));

    if (loginUser.fulfilled.match(res)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow"
      >
        <h1 className="text-2xl font-bold mb-6">Login to SyncBoard</h1>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg px-4 py-3 mb-4"
        />

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg px-4 py-3 mb-4"
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm mt-4 text-center">
          New user?{" "}
          <Link className="font-semibold" to="/register">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}