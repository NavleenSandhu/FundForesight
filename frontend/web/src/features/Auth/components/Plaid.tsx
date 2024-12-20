import { Button, buttonVariants } from "@/components/ui/button";
import { fetchProfile } from "@/store/profiles/profilesSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SelectCountry from "./SelectCountry";

function Plaid() {
    const dispatch = useDispatch<AppDispatch>()
    const [linkToken, setLinkToken] = useState<string | null>(null)
    const [transactionsAdded, setTransactionsAdded] = useState<boolean>(false)
    const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL
    const navigate = useNavigate()
    const { profile } = useSelector((state: RootState) => state.profile)
    useEffect(() => {

        async function fetchLinkToken() {
            dispatch(fetchProfile())
            try {
                const res = await fetch(`${GATEWAY_URL}/plaidAccounts/link-token`, {
                    method: "GET",
                    credentials: "include"
                })
                if (res.ok) {
                    const data = await res.json()
                    setLinkToken(data.linkToken)
                }
            } catch (error) {
                console.error(error);
            }
        }
        const timeOut = setTimeout(async () => await fetchLinkToken(), 2000);
        return () => clearTimeout(timeOut);
    }, [profile?.countryCode])

    const onSuccess = useCallback(async (publicToken: string) => {
        try {
            const res = await fetch(`${GATEWAY_URL}/plaidAccounts/addPlaidAccount`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ publicToken })
            })
            // Create a default(Other) budget
            if (res.ok) {
                setTransactionsAdded(true)
                navigate('/dashboard/home')
            }
        } catch (error) {
            console.error(error);
        }
    }, [])

    const { open, ready } = usePlaidLink({ token: linkToken, onSuccess })

    return (
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 lg:p-12">
            <div className="w-full max-w-sm">
                <h2 className="text-2xl font-semibold text-center">Link Your Bank Account</h2>
                <p className="text-center mt-2 mb-8">
                    Connect your bank account to start managing your finances with Fund Foresight.
                </p>

                <div className="space-y-6">
                    <Button
                        onClick={() => open()}
                        disabled={!ready}
                        variant={'default'}
                    >
                        Connect Bank Account
                    </Button>
                    {!profile ?
                        <>
                            <SelectCountry />
                            <p className="text-sm text-muted-foreground">You need to select a country to link a bank account</p>
                        </>
                        :
                        <Link to='/dashboard/home'
                            className={buttonVariants({
                                variant: 'outline'
                            })}
                        >
                            Skip for Now
                        </Link>
                    }

                    {transactionsAdded && (
                        <div className="mt-4 text-center text-green-600 font-medium">
                            Bank account successfully linked!
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Plaid;