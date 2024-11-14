// src/pages/Login.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";

const minPasswordLen: number = 8
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(minPasswordLen, `Password must be at least ${minPasswordLen} characters`),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

function Login() {
    const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL
    const navigate = useNavigate()
    const form = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = async (data: LoginFormInputs) => {
        const res = await fetch(`${GATEWAY_URL}/login`, {
            method: 'POST',
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        if (res.status === 200) {
            navigate("/auth/plaidAccount");
        }
        else {
            console.error("Error while Login");
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 lg:p-12">
            <div className="w-full max-w-sm">
                <h2 className="text-2xl font-semibold text-center">Create an account</h2>
                <p className="text-center mt-2 mb-8">Enter your email below to create your account</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
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
                            Sign In with Email
                        </Button>
                    </form>
                </Form>
                <p className="text-center mt-6 text-sm">
                    Don’t have an account?{" "}
                    <Link to="/auth/register" className={buttonVariants({
                        variant: 'link',
                    })}>
                        Sign up
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
                })}>
                    <FcGoogle className="mr-2" />Google
                </Link>
            </div>
        </div>
    );
}

export default Login;
