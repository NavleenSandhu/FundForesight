import Login from '@/features/Auth/components/Login';
import Register from '@/features/Auth/components/Register';

import { Route, Routes } from 'react-router-dom';
import Plaid from '../components/Plaid';

export default function Auth() {

    return (
        <div className="flex h-screen">
            <div className="dark hidden lg:flex flex-col justify-between w-1/2 p-8">
                <div className="text-lg font-bold">Fund Foresight Inc</div>
                <div className="text-sm">
                    “Fund Foresight provides innovative software solutions designed to simplify and solve financial challenges. Our tools empower users to take control of their budgeting and financial planning, making complex financial management accessible to everyone.”
                    <br />
                    <span className="font-semibold">Fund Foresight Team</span>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center py-8">
                <Routes>
                    
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/plaidAccount' element={<Plaid />} />
                </Routes>
            </div>
        </div>
    );
}
