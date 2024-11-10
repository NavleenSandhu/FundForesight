import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useNavigate } from "react-router-dom";

function Plaid() {
    const [linkToken, setLinkToken] = useState<string | null>(null)
    const [transactionsAdded, setTransactionsAdded] = useState<boolean>(false)
    const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL
    const navigate = useNavigate()
    useEffect(() => {
        async function fetchLinkToken() {
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
        fetchLinkToken()
    }, [])

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
                navigate('/dashboard')
            }
        } catch (error) {
            console.error(error);
        }
    }, [])

    const { open, ready } = usePlaidLink({ token: linkToken, onSuccess })

    const handleSkip = () => {
        navigate('/dashboard')
    }
    return (
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 lg:p-12">
            <div className="w-full max-w-sm">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Link Your Bank Account</h2>
                <p className="text-center text-gray-500 mt-2 mb-8">
                    Connect your bank account to start managing your finances with Fund Foresight.
                </p>

                <div className="space-y-6">
                    <Button
                        onClick={() => open()}
                        disabled={!ready}
                        className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
                    >
                        Connect Bank Account
                    </Button>

                    <Button
                        onClick={handleSkip}
                        variant="outline"
                        className="w-full border-gray-300 text-gray-600 py-2 rounded-md hover:bg-gray-100"
                    >
                        Skip for Now
                    </Button>

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