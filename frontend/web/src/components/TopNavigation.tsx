import { Link, useLocation } from 'react-router-dom';
import DropDown from './DropDown';
import { buttonVariants } from './ui/button';
function TopNavigation() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname.startsWith(path) ? 'default' : 'outline'
    return (
        <div className="w-full py-3 px-4 shadow-md hidden md:flex fixed z-50 backdrop-blur-sm bg-white/30 ">

            <div className="text-lg font-semibold mx-4">Fund Foresight</div>
            <div className="space-x-4">
                <Link to='/dashboard/home' className={`${buttonVariants({ variant: isActive('/dashboard/home') })}`}>
                    Home
                </Link>
                <Link to='/dashboard/transactions' className={`${buttonVariants({ variant: isActive('/dashboard/transactions') })} }`}>
                    Transactions
                </Link>
                <Link to='/dashboard/budgets' className={`${buttonVariants({ variant: isActive('/dashboard/budgets') })} }`}>
                    Budgets
                </Link>
                <Link to='/dashboard/savingGoals' className={`${buttonVariants({ variant: isActive('/dashboard/savingGoals') })}`}>
                    Saving Goals
                </Link>
            </div>
            <div className='ml-auto mt-auto mb-auto'>

                <DropDown ></DropDown>
            </div>
        </div>
    )
}

export default TopNavigation
