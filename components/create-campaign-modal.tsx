"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react";
import CreateCampaignForm from "./create-campaign-form";
import { PlusIcon } from "lucide-react";

export default function CreateCampaignModal({ user }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <div className="flex flex-col">
                <div className="flex flex-row justify-end pb-3">
                    <Button onPress={onOpen} color="primary">
                        <PlusIcon></PlusIcon>
                        Add New
                    </Button>
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