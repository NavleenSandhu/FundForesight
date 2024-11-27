import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";

function NotFound() {

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-lg mb-8">Oops! The page you are looking for does not exist.</p>
            <Link
                to="/dashboard/home"
                className={buttonVariants({
                    variant: "default"
                })}
            >
                Go to Homepage
            </Link>
        </div>
    );
}

export default NotFound;
