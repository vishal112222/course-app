// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import handler from "@/app/api/auth/sign-in/route";

// const SignupForm = () => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleSignup = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log({ username, email, password, confirmPassword });
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen ">
//       <Card className="w-[400px] max-w-2xl shadow-lg border border-gray-200 rounded-lg">
//         <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 p-5 rounded-t-lg">
//           <CardTitle className="text-3xl text-white text-center">Sign Up</CardTitle>
//         </CardHeader>
//         <CardContent className="p-4">
//           <form onSubmit={handleSignup} className="flex flex-col gap-6">
//             {/* Username Field */}
//             <div className="grid gap-2">
//               <Label htmlFor="username" className="text-gray-700 text-lg">
//                 Username
//               </Label>
//               <Input
//                 id="username"
//                 type="text"
//                 placeholder="Your username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="p-4 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                 required
//               />
//             </div>
//             {/* Email Field */}
//             <div className="grid gap-2">
//               <Label htmlFor="email" className="text-gray-700 text-lg">
//                 Email
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="m@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="p-4 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                 required
//               />
//             </div>
//             {/* Password Field */}
//             <div className="grid gap-2">
//               <Label htmlFor="password" className="text-gray-700 text-lg">
//                 Password
//               </Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="Your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="p-4 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                 required
//               />
//             </div>
//             {/* Confirm Password Field */}
//             <div className="grid gap-2">
//               <Label htmlFor="confirm-password" className="text-gray-700 text-lg">
//                 Confirm Password
//               </Label>
//               <Input
//                 id="confirm-password"
//                 type="password"
//                 placeholder="Re-enter your password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="p-4 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
//                 required
//               />
//             </div>
//             {/* Sign Up Button */}
//             <Button
//               type="submit"
//               onClick={handler}
//               className="w-full p-4 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
//             >
//               Sign Up
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default SignupForm;


"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormDescription, FormField, FormLabel, FormMessage, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import toast from "react-hot-toast";

// Zod validation schema for the form
const formSchema = z.object({
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Type inference from the schema
type FormData = z.infer<typeof formSchema>;

const SignupPage = () => {
    const router = useRouter();
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    // On form submission, send data to the API
    const onSubmit = async (values: FormData) => {
        try {
            console.log("1111111111111",values)
            const response = await axios.post("/api/auth/sign-up", values);
            console.log("response",response)
            // Redirect the user upon successful signup
            router.push(`/`);
            toast.success("Account created successfully");
        } catch (error) {
            toast.error("Something went wrong! Please try again.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">Create your account</h1>
                <p className="text-sm text-slate-600">Fill in the details to sign up</p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Choose a username"
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
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Your email address"
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
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            disabled={isSubmitting}
                                            placeholder="Your password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center gap-x-2">
                            <Link href="/login">
                                <Button type="button" variant="ghost">
                                    Already have an account? Login
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                                className="bg-black text-white hover:bg-black"
                            >
                                Sign Up
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default SignupPage;

