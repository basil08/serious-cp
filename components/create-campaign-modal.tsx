"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";
import CreateCampaignForm from "./create-campaign-form";
import { PlusIcon } from "lucide-react";


interface ICampaign {
    id: String,
    name: String,
    userId: String,
    numProblems: Number,
    targetDuration: Number,
    cfHandle: String,
    createdAt: String,
    status: String,
    activatedOn: String | null, // sus
    hasPledgedAmount: Boolean,
    pledgedAmount: Number,
    pledgeCurrency: String,
};

export default function CreateCampaignModal({ user }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [payouts, setPayouts] = useState<ICampaign[]>([]);
    const [failed, setFailed] = useState<ICampaign[]>([]);

    // const computePayouts = () => {}
    async function computePayouts() {

        const res = await fetch(`/api/payout?userId=${user.id}`, {
            method: 'GET'
        });

        if (res.ok) {
            const { payouts, failed } = await res.json();
            setPayouts(payouts);
            setFailed(failed);
        } else {
            const data = await res.json();
            throw new Error(data.message);
        }
    }

    return (
        <>
            <div className="flex flex-col">
                <div className="flex flex-row justify-between pb-3">
                    <Button onPress={onOpen} color="secondary">
                        <PlusIcon></PlusIcon>
                        Add New
                    </Button>
                    <Button onPress={() => computePayouts()} color="secondary">
                        <PlusIcon></PlusIcon>
                        Compute Payouts
                    </Button>
                </div>
                <div className="flex flex-row justify-start pb-3">
                    Payouts: {JSON.stringify(payouts)}
                </div>
                <div className="flex flex-row justify-start pb-3">
                    Failed: {JSON.stringify(failed)}
                </div>
            </div>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Create New Campaign</ModalHeader>
                            <ModalBody>
                                <CreateCampaignForm user={user} />
                            </ModalBody>
                            <ModalFooter>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}