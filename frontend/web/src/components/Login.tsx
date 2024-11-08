// src/pages/Login.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { FcGoogle } from "react-icons/fc";

const minPasswordLen: number = 8
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(minPasswordLen, `Password must be at least ${minPasswordLen} characters`),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

function Login() {
    const form = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = (data: LoginFormInputs) => {
        console.log("Login Data:", data);
    };

    return (
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 lg:p-12">
            <div className="w-full max-w-sm">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Create an account</h2>
                <p className="text-center text-gray-500 mt-2 mb-8">Enter your email below to create your account</p>
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
                                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
                                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800">
                            Sign In with Email
                        </Button>
                    </form>
                </Form>
                <p className="text-center text-gray-500 mt-6 text-sm">
                    Don’t have an account?{" "}
                    <a href="/auth/register" className="hover:underline">
                        Sign up
                    </a>
                </p>
                <div className="flex items-center my-4">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="px-4 text-gray-500">OR CONTINUE WITH</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>
                <Button variant="outline" className="w-full flex items-center justify-center border-gray-300">
                    <FcGoogle className="mr-2" />Google
                </Button>
            </div>
        </div>
    );
}

export default Login;
