import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-lg mb-8">Oops! The page you are looking for does not exist.</p>
            <button
                onClick={() => navigate("/auth/login")}
                className="px-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800"
            >
                Go to Homepage
            </button>
        </div>
    );
}

export default NotFound;
