import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';


export async function GET(req: Request) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const pledgedAmount = searchParams.get("pledgedAmount");
    const pledgeCurrency = searchParams.get("pledgeCurrency");

    const instance = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const response = await instance.orders.create({
        amount: pledgedAmount * 100, // input in the smallest denomination, TODO: handle different currency cases
        currency: pledgeCurrency,
        receipt: `receipt#${Math.ceil(Math.random() * 1000000000)}`

    });

    if (!response.error) {
        return NextResponse.json(response, {status: 200});
    } else {
        return NextResponse.json(response, {status: 501});
    }
}

export async function POST(req: Request) {
  const { amount, currency, receipt } = await req.json();

  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
