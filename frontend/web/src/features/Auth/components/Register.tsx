import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Button, buttonVariants } from "../../../components/ui/button";
import { Form, FormField, FormItem, FormControl, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
const minUsernameLen: number = 3
const maxUsernameLen: number = 40
const minPasswordLen: number = 8
const registerSchema = z.object({
    username: z.string().min(minUsernameLen, `Username must be at least ${minUsernameLen} characters`).max(maxUsernameLen, `Username must not be more than ${maxUsernameLen} characters`),
    email: z.string().email("Invalid email address"),
    password: z.string().min(minPasswordLen, `Password must be at least ${minPasswordLen} characters`),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;


function Register() {
    const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL
    const navigate = useNavigate()
    const form = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const handleRegister = async (data: RegisterFormInputs) => {
        const res = await fetch(`${GATEWAY_URL}/register`, {
            method: 'POST',
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        if (res.status === 201) {
            navigate("/auth/plaidAccount")
        }
        else {
            console.error("Error while registering");
        }
    };
    return (
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 lg:p-12">
            <div className="w-full max-w-sm">
                <h2 className="text-2xl font-semibold text-center">Create an account</h2>
                <p className="text-center mt-2 mb-8">Sign up to start managing your finances with Fund Foresight</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Enter your username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter your password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">
                            Sign Up
                        </Button>
                    </form>
                </Form>
                <p className="text-center mt-6 text-sm">
                    Already have an account?{" "}
                    <Link to="/auth/login" className={buttonVariants({
                        variant:'link'
                    })}>
                        Log In
                    </Link>
                </p>
                <div className="flex items-center my-4">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="px-4">OR CONTINUE WITH</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>
                <Link to='/auth/plaidAccount' className={buttonVariants({
                    variant: 'outline',
                    className: 'w-full'
                })} >
                    <FcGoogle className="mr-2" />Google
                </Link>
            </div>
        </div>

    )
}

export default Register;