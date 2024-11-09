import Login from '@/components/Login'
import Register from '@/components/Register'
import { Routes, Route } from 'react-router-dom'

export default function Auth() {

    return (
        <div className="flex h-screen">
            <div className="hidden lg:flex flex-col justify-between bg-gray-900 text-white w-1/2 p-8">
                <div className="text-lg font-bold">Fund Foresight Inc</div>
                <div className="text-sm">
                    “Fund Foresight provides innovative software solutions designed to simplify and solve financial challenges. Our tools empower users to take control of their budgeting and financial planning, making complex financial management accessible to everyone.”
                    <br />
                    <span className="font-semibold">Fund Foresight Team</span>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-8">
                <Routes>
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                </Routes>
            </div>
        </div>
    );
}
