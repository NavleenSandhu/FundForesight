import { AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";

interface AlertProps {
    title: string;
    message: string;
}

const AlertBox: React.FC<AlertProps> = ({ title, message }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
        } else {
            setIsVisible(false)
        }
    }, [message]);

    return (
        <div
            className={`transition-all duration-500 transform  ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-5 scale-50"
                }`}
        >
            <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>{title} Error</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </Alert>
        </div>
    );
};

export default AlertBox;
