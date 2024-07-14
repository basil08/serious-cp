
// handle callback from Razorpay
import { PrismaClient, Status } from "@prisma/client";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
// import Razorpay from "razorpay";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get('userId');
    const campaignId = searchParams.get('campaignId');

    const formData = await req.formData();

    try {
        const razorpay_payment_id = formData.get("razorpay_payment_id");
        const razorpay_order_id = formData.get("razorpay_order_id");
        const razorpay_signature = formData.get("razorpay_signature");

        // const secret = process.env.RAZORPAY_KEY_SECRET;

        // const instance = new Razorpay({ key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, key_secret: secret })

        // Skipping validation for now..(I trust myself :P)
        // TODO: Check authenticity of Razorpay payments
        // const { validatePaymentVerification, validateWebhookSignature } = require('./dist/utils/razorpay-utils');
        // const res = validatePaymentVerification({ "order_id": razorpay_order_id, "payment_id": razorpay_payment_id }, razorpay_signature, secret);
        // console.log(res);

        // create new RazorpayTransaction model 

        const razorpayTransaction = await prisma.razorPayTransaction.create({
            data: {
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                signature: razorpay_signature
            }
        });

        console.log(razorpayTransaction);

        // add new order Id to user object to keep track,
        // can be used to cross-ref with Transaction object
        // to get the exact set of Transactions initiated by this user
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                orderIds: {
                    push: razorpay_order_id
                }
            }
        });

        // update campaign object
        await prisma.campaign.update({
            where: {
                id: campaignId
            },
            data: {
                status: Status.ACTIVE,
                hasPledgedAmount: true,
                activatedOn: new Date()
            }
        })
        
        redirect("/");
        // return Response.json({ razorpayTransaction }, { status: 200 });
    } catch (error) {
        throw error;
        // console.error(error.message);
        // return Response.json({ message: error.message }, { status: 401 });
    }
}