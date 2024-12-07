import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";

import { persistor } from "@/store/store";
import { IoIosArrowDropdown } from "react-icons/io";

export default function DropDown() {
  const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL
    const navigate = useNavigate()
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
          <IoIosArrowDropdown  />
        </DropdownMenuTrigger>
       
      <DropdownMenuContent>
        <DropdownMenuLabel>Notifications <Switch></Switch></DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Notifications 
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
