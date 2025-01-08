// import { db } from "@/lib/db";
// import { currentUser } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import { stripe } from "@/lib/stripe";

// export async function POST(
//     req: Request,
//     { params }: { params: { courseId: string } }
// ) {
//     try {

//         const user = await currentUser();   
//         // const courseId = await params;

//         if (!user || !user.id) {
//             return new NextResponse("Unauthorized", { status: 401 });
//         }

//         const course = await db.course.findUnique({
//             where: {
//                 id: params.courseId,
//                 isPublished: true,
//             },
//         });

//         const purchase = await db.purchase.findUnique({
//             where: {
//                 userId_courseId: {
//                     userId: user.id,
//                     courseId: params.courseId,
//                 },
//             },
//         });

//         if (purchase) {
//             return new NextResponse("Already Purchased", { status: 400 });
//         }

//         if (!course) {
//             return new NextResponse("Not Found", { status: 404 });
//         }   

//         const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
//             {
//                 price_data: {
//                     currency: "usd",
//                     product_data: {
//                         name: course.title,
//                     },
//                     unit_amount: Math.round(course.price! * 100),
//                 },
//                 quantity: 1,
//             },
//         ];

//         let stripeCustomer = await db.stripeCustomer.findUnique({
//             where: {
//                 userId: user.id,
//             },
//             select: {
//                 stripeCustomerId: true,
//             },
//         });

//         if (!stripeCustomer) {
//             const customer = await stripe.customers.create({
//                 email: user.emailAddresses?.[0]?.emailAddress,
//             });

//             stripeCustomer = await db.stripeCustomer.create({
//                 data: {
//                     userId: user.id,
//                     stripeCustomerId: customer.id,
//                 },
//             });
//         }

//         const session = await stripe.checkout.sessions.create({
//             customer: stripeCustomer.stripeCustomerId,
//             line_items: lineItems,
//             mode: "payment",
//             success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
//             cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
//             metadata: {
//                 courseId: course.id,
//                 userId: user.id,
//             },
//         });

//         return NextResponse.json({ url: session.url });
        
//     } catch (error) {
//         console.log("COURSE_ID_CHECKOUT", error);
//         return new NextResponse("Internal Error", { status: 500 });
//     }
// }


import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        // Get current user from Clerk
        const user = await currentUser();   

        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Fetch the course based on courseId
        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                isPublished: true,
            },
        });

        // Check if the user has already purchased the course
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: params.courseId,
                },
            },
        });

        if (purchase) {
            return new NextResponse("Already Purchased", { status: 400 });
        }

        if (!course) {
            return new NextResponse("Not Found", { status: 404 });
        }

        // Ensure course price exists
        if (!course.price) {
            return new NextResponse("Course price is missing", { status: 400 });
        }

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: course.title,
                    },
                    unit_amount: Math.round(course.price * 100), // Convert to cents
                },
                quantity: 1,
            },
        ];

        // Check if the user has a Stripe customer object
        let stripeCustomer = await db.stripeCustomer.findUnique({
            where: {
                userId: user.id,
            },
            select: {
                stripeCustomerId: true,
            },
        });

        if (!stripeCustomer) {
            // Create Stripe customer if it doesn't exist
            const customer = await stripe.customers.create({
                email: user.emailAddresses?.[0]?.emailAddress, // Ensure this exists
            });

            // Store Stripe customer ID in the database
            stripeCustomer = await db.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id,
                },
            });
        }

        // Create a Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
            metadata: {
                courseId: course.id,
                userId: user.id,
            },
        });
        // console.log(NextResponse.json)

        return NextResponse.json({ url: session.url });
        
    } catch (error) {
        console.error("COURSE_ID_CHECKOUT", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
