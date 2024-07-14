"use client";
import PledgeButton from "@/components/pledge-button";
import { useSearchParams } from 'next/navigation'

export default async function Page() {
    const searchParams = useSearchParams()
    const email = searchParams.get('email')
    const pledgedAmount = searchParams.get('pledgedAmount');
    const pledgeCurrency = searchParams.get('pledgeCurrency');
    const userId = searchParams.get('userId');
    const campaignId = searchParams.get('campaignId');

    return (
        <div>
            <p className="text-3xl font-bold leading-none tracking-tight dark:text-white pb-2">Pledge page</p>

            <PledgeButton email={String(email)} userId={String(userId)} campaignId={String(campaignId)} pledgedAmount={Number(pledgedAmount)} pledgeCurrency={String(pledgeCurrency)} />
        </div>
    )
}