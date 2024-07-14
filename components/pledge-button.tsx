"use client";

import { Button, Chip } from "@nextui-org/react";
import { useState } from "react";

export default function PledgeButton(props:
    {
        email: String,
        pledgedAmount: Number,
        pledgeCurrency: String,
        userId: String,
        campaignId: String
    }) {
    const [error, setError] = useState<String | undefined>();
    const [orderId, setOrderId] = useState<String | undefined>();
    const [showPay, setShowPay] = useState<Boolean>(false);
    const [info, setInfo] = useState<String | undefined>();

    const pledgedAmount: Number = props.pledgedAmount;
    const pledgeCurrency: String = props.pledgeCurrency;
    const email: String = props.email;
    const userId: String = props.userId;
    const campaignId: String = props.campaignId;

    async function createOrder(pledgedAmount: Number, pledgeCurrency: String) {
        setInfo("");
        setError("");

        try {
            const response = await fetch(`/api/razorpay/order?pledgedAmount=${String(pledgedAmount)}&pledgeCurrency=${pledgeCurrency}`, {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                setOrderId(data.id);
                setShowPay(true);
                setInfo("Order created successfully, please proceed to transfer funds!");
            } else {
                const data = await response.json();
                throw new Error(data.description);
            }
        } catch (error) {
            setError(error.message);
        }
    }

    const loadScript = (src: string) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    async function kickStartPayment(orderId: String, userId: String, campaignId: String) {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            alert("Razropay failed to load!!");
            return;
        }

        const options = {
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: String(pledgedAmount),
            currency: pledgeCurrency,
            name: "Serious CP Demo App",
            description: "Lock your money to get better at CP",
            order_id: orderId,
            callback_url: `http://localhost:3000/api/razorpay/order/success?userId=${userId}&campaignId=${campaignId}`,
            prefill: {
                email: email
            }
        };

        const rzpay = new window.Razorpay(options);

        rzpay.open();
    }   

    return (
        <>
            <div className="flex flex-col">

                {error && <div color="red">{error}</div>}
                {info && <Chip color="success" className="text-white">{info}</Chip>}
                <p>You are about to lock your funds into the app. This process is required to activate the campaign.</p>
                <div className="m-3 flex flex-col">
                    <Button className="m-2" onPress={() => createOrder(pledgedAmount, pledgeCurrency)}>Create Order</Button>
                    <Button className="m-2" color="primary" isDisabled={!showPay} onPress={() => kickStartPayment(orderId, userId, campaignId)}>Pay</Button>
                </div>
            </div>

            {/* <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
            >

                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Pledge Funds</ModalHeader>
                            <ModalBody>



                            </ModalBody>
                            <ModalFooter>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal> */}
        </>
    )
}