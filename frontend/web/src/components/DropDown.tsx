import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import { Switch } from "@/components/ui/switch";
import { Link, useNavigate } from "react-router-dom";

import { AppDispatch, persistor, RootState } from "@/store/store";
import { UserCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { editProfile } from "@/store/profiles/profilesSlice";

export default function DropDown() {
	const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL
	const { profile } = useSelector((state: RootState) => state.profile)
	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()

	const handleSwitchChange = () => {
		dispatch(editProfile({
			...profile,
			...{
				receiveNotifications: !profile.receiveNotifications
			}
		}))
	}

	const handleLogout = async () => {
		const res = await fetch(`${GATEWAY_URL}/logout`, {
			method: 'POST',
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			}
		})
		if (res.status === 200) {
			persistor.purge();
			navigate('/auth/login')
		}
	}


	return (
		<DropdownMenu>

			<DropdownMenuTrigger >
				<UserCircle className="w-6 h-6" />
			</DropdownMenuTrigger>

			<DropdownMenuContent className="px-2">
				<DropdownMenuLabel className="flex"><span className="mr-3">Notifications</span> <Switch onCheckedChange={handleSwitchChange} checked={profile.receiveNotifications} /></DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem><Link to="/auth/plaidAccount">Link bank accounts</Link></DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>Sign Out</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
