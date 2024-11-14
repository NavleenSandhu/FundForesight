import { buttonVariants } from './ui/button'
import { Link, useLocation } from 'react-router-dom'

function TopNavigation() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname.startsWith(path) ? 'default' : 'outline'
    return (
        <div className="w-full py-3 px-4 shadow-md hidden md:flex">

            <div className="text-lg font-semibold mx-4">Fund Foresight</div>
            <div className="space-x-4">
                <Link to='/dashboard/home' className={`${buttonVariants({ variant: isActive('/dashboard/home') })}`}>
                    Home
                </Link>
                <Link to='/dashboard/analytics' className={`${buttonVariants({ variant: isActive('/dashboard/analytics') })}`}>
                    Analytics
                </Link>
                <Link to='/dashboard/transactions' className={`${buttonVariants({ variant: isActive('/dashboard/transactions') })} }`}>
                    Transactions
                </Link>
                <Link to='/dashboard/budgets' className={`${buttonVariants({ variant: isActive('/dashboard/budgets') })} }`}>
                    Budgets
                </Link>
                <Link to='/dashboard/profile' className={`${buttonVariants({ variant: isActive('/dashboard/profile') })}}`}>
                    Profile
                </Link>
            </div>
        </div>
    )
}

export default TopNavigation
