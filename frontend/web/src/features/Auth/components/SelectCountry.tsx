import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addProfile } from '@/store/profiles/profilesSlice'
import { AppDispatch } from '@/store/store'
import { countryCodes } from '@/utils/countryCodes'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

function SelectCountry() {
    const [countryCode, setCountryCode] = useState(countryCodes[0].code);
    const dispatch = useDispatch<AppDispatch>()
    const handleSubmit = () => {
        dispatch(addProfile(countryCode))
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Select Country</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-3/4 rounded-md">
                <DialogHeader>
                    <DialogTitle>Edit budget</DialogTitle>
                </DialogHeader>
                <Select onValueChange={(value) => setCountryCode(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                        {countryCodes.map((code) => (
                            <SelectItem key={code.code} value={code.code}>
                                {code.name} ({code.code})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <DialogFooter className="space-x-4">
                    <DialogClose asChild>
                        <Button onClick={handleSubmit}>Save Changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SelectCountry
