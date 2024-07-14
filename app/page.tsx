import { auth } from "auth"
import CampaignTable from "@/components/campaign-table";
import CreateCampaignModal from "@/components/create-campaign-modal";

export default async function Index() {
  const session = await auth();

  if (!session?.user) { return <div>Please sign in to continue...</div> }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <CreateCampaignModal user={session.user} />
      <CampaignTable user={session.user} />
    </div>
  )
}
