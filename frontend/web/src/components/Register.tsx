import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Button } from "./ui/button";
import { Form, FormField, FormItem, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

    const form = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const handleRegister = (data: RegisterFormInputs) => {
        console.log("Register Data:", data);
    };
    return (
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 lg:p-12">
            <div className="w-full max-w-sm">
                <h2 className="text-2xl font-semibold text-center text-gray-800">Create an account</h2>
                <p className="text-center text-gray-500 mt-2 mb-8">Sign up to start managing your finances with Fund Foresight</p>
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
                                            className="border-gray-300 focus:border-black focus:ring-black"
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
                                            className="border-gray-300 focus:border-black focus:ring-black"
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
                                            className="border-gray-300 focus:border-black focus:ring-black"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800">
                            Sign Up
                        </Button>
                    </form>
                </Form>
                <p className="text-center text-gray-500 mt-6 text-sm">
                    Already have an account?{" "}
                    <a href="/auth/login" className="hover:underline">
                        Log in
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

    )
}

export default Register;