"use client";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue } from "@nextui-org/table";
import { useEffect, useState, useTransition } from "react";
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import PledgeButton from "./pledge-button";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button, Chip, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";


export default function CampaignTable(props: { user: any }) {

    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<String | undefined>();
    const [campaignsData, setCampaigns] = useState<ICampaign[]>([]);

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

    useEffect(() => {
        async function getCampaigns() {
            setLoading(true);
            try {
                // console.log("Debug: User ID", props.user.id);

                if (!props.user.id) {
                    throw new Error("User Id required to retrieve campaigns!");
                }

                const response = await fetch(`/api/campaign?userId=${props.user.id}`, {
                    method: 'GET',
                    cache: 'no-store'
                });

                if (response.ok) {
                    const campaigns = await response.json();
                    setCampaigns(campaigns.campaigns);
                } else {
                    const data = await response.json();
                    throw new Error(data.message);
                }
            } catch (error: any) {
                setError(error);
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        getCampaigns();
    }, []);

    const columns = [
        {
            key: "NAME",
            label: "Campaign Name"
        },
        {
            key: "ENDS_IN",
            label: "Ends in"
        },
        {
            key: "PROBLEMS_PER_DAY",
            label: "Problems/Day"
        },
        {
            key: "PLEDGED_AMOUNT",
            label: "Pledged Amount"
        },
        {
            key: "STATUS",
            label: "Status"
        },
        {
            key: "ACTIONS",
            label: "Actions"
        }
    ];

    const chipMapping = {
        "CREATED": "default",
        "ACTIVE": "secondary",
        "SUCCESS": "success",
        "FAILED": "danger"
    }

    const [isPending, startTransition] = useTransition();


    async function deleteCampaign(id: String) {
        try {
            const deleted = await fetch(`/api/campaign?campaignId=${id}`, {
                method: 'DELETE',
                cache: 'no-store'
            });

            if (deleted.ok) {
                const deletedData = await deleted.json();
                console.log(deletedData.deletedCampaign);
                
                // router.refresh();
                window.location.reload();
            } else {
                const response = await deleted.json();
                throw new Error(response.message);
            }
        } catch (error) {
            setError(error);
            console.error(error.message);
        }
    }

    return (
        <div>
            {error && <Chip color="danger">{error}</Chip>}

            <Table aria-label="Table showing all campaigns of the current user">
                <TableHeader>
                    {columns.map((column) =>
                        <TableColumn key={column.key}>{column.label}</TableColumn>
                    )}
                </TableHeader>
                {
                    <TableBody emptyContent="No rows to display" isLoading={loading} loadingContent={<Spinner label="Loading..." />}>
                        {Array.from(campaignsData).map((c) =>
                            <TableRow key={campaignsData.indexOf(c)}>
                                <TableCell>{c.name}</TableCell>
                                <TableCell>{
                                    c.activatedOn ?
                                        // TODO: Sort this out....
                                        formatDistance(Date.parse(c.activatedOn) + c.targetDuration * 24 * 60 * 60 * 1000, new Date())
                                        : "NA"
                                }</TableCell>
                                <TableCell>{JSON.stringify(c.numProblems)}</TableCell>
                                <TableCell>{c.pledgeCurrency + " " + String(c.pledgedAmount)}</TableCell>
                                <TableCell>
                                    <Chip color={chipMapping[c.status]}>
                                        {c.status}
                                    </Chip>
                                </TableCell>
                                <TableCell className="flex flex-row gap-4">
                                    {/* <Rocket fill="primary"> */}
                                    <Button color="default" onClick={(e) => e.preventDefault()} isDisabled={c.hasPledgedAmount.valueOf()}>
                                        <Link href={`/pledge?email=${props.user.email}&pledgedAmount=${c.pledgedAmount}&pledgeCurrency=${c.pledgeCurrency}&userId=${props.user.id}&campaignId=${c.id}`}>Pledge</Link>
                                    </Button>
                                    {/* </Rocket> */}
                                    <Button color="danger"
                                        // isDisabled={c.hasPledgedAmount.valueOf()}
                                        onClick={() => deleteCampaign(c.id)}>
                                        <Trash2 color="white"></Trash2>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                }
            </Table>
        </div>
    )
}