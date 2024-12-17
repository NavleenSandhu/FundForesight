import { useEffect } from 'react'
import { useRouter } from 'expo-router'

const Home = () => {
    const router = useRouter()
    const GATEWAY_URL = process.env.EXPO_PUBLIC_GATEWAY_URL
    useEffect(() => {
        (async () => {
            const res = await fetch(`${GATEWAY_URL}/validateUser`, {
                method: "GET",
                credentials: "include",
            })
            if (res.status === 401) {
                router.replace('/login')
            } else if (res.status === 200) {
                router.replace('/overview')
            }
        })()
    }, [])
}

export default Home