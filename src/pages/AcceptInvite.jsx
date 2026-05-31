import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { acceptInvitation } from "../store/projectSlice";

export default function AcceptInvite() {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error } = useSelector((state) => state.projects);

  useEffect(() => {
    const accept = async () => {
      try {
        const result = await dispatch(acceptInvitation(token)).unwrap();

        navigate(`/projects/${result.projectId}`);
      } catch {
        //
      }
    };

    accept();
  }, [dispatch, navigate, token]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
        {!error ? (
          <>
            <h1 className="text-xl font-bold text-slate-950">
              Accepting invitation...
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Please wait while we add you to the project.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-red-600">
              Invitation failed
            </h1>
            <p className="mt-2 text-sm text-slate-500">{error}</p>

            <Link
              to="/projects"
              className="mt-5 inline-block rounded-xl bg-slate-950 px-5 py-3 text-sm font-medium text-white"
            >
              Go to Projects
            </Link>
          </>
        )}
      </div>
    </main>
  );
}