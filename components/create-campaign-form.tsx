"use client"
import { useState, FormEvent } from "react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { useRouter } from 'next/navigation';

export default function CreateCampaignForm({ user }) {
    const router = useRouter();

    const [error, setError] = useState<String | null>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [info, setInfo] = useState<String | null>();

    async function createCampaignOnSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)
        setInfo(null)

        try {
            const formData = new FormData(event.currentTarget)
            // const formDataJSON = JSON.stringify(Object.fromEntries(formData));
            // console.log(formDataJSON);
            
            const response = await fetch('/api/campaign', {
                method: 'POST',
                // body: JSON.stringify({...Object.fromEntries(formData), userId: user.id })
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setInfo(data.message);
                console.log(data.message);
                window.location.reload();
            } else {
                const data = await response.json();
                throw new Error(data.message);
            }
        } catch (error: any) {
            setError(error);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {info && <div style={{ color: 'green' }}>{info}</div>}


            <form onSubmit={createCampaignOnSubmit} className="p-3">
                <Input type="hidden" name="userId" className="p-1" value={user.id}></Input>
                <Input className="p-1" name="name" type="text" label="Campaign Name" />
                <Input className="p-1" name="numProblems" type="number" label="Num Problems" />
                <Input className="p-1" name="targetDuration" type="number" label="Target Duration (in days)" />
                <Input className="p-1" name="pledgedAmount" type="number" label="Pledged Amount" />
                <Input className="p-1" name="pledgeCurrency" type="text" label="Pledged Currency" />
                <Input className="p-1" name="cfHandle" type="text" label="Codeforces Handle" />

                {/* <div className="flex flex-col"> */}
                <Button className="flex flex-row justify-end" color="primary" type="submit" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Create Campaign'}
                </Button>
                {/* </div> */}
            </form>

        </div>
    )
}