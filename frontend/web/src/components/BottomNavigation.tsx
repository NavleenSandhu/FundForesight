import { BarChart, Home, Layers, Repeat, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { buttonVariants } from "./ui/button";

interface NavItem {
    icon: JSX.Element;
    label: string;
    path: string;
}

const navItems: NavItem[] = [
    { icon: <Home className="w-6 h-6" />, label: "Home", path: "/dashboard/home" },
    { icon: <BarChart className="w-6 h-6" />, label: "Analytics", path: "/dashboard/analytics" },
    { icon: <Repeat className="w-6 h-6" />, label: "Transactions", path: "/dashboard/transactions" },
    { icon: <Layers className="w-6 h-6" />, label: "Budgets", path: "/dashboard/budgets" },
    { icon: <User className="w-6 h-6" />, label: "Profile", path: "/dashboard/profile" },
];

function BottomNavigation() {
    const location = useLocation()
    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 shadow-lg flex justify-around items-center rounded-t-3xl md:hidden bg-white">
            {navItems.map((item, index) => (
                <Link key={index} to={item.path} className={
                    buttonVariants({
                        variant: location.pathname === item.path ? 'default' : 'outline'
                    })
                }>{item.icon}
                    <span className="sr-only">{item.label}</span>
                </Link>
            ))
            }
        </div >
    )
}

export default BottomNavigation