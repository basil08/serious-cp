import { PrismaClient, Status } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    // for the current user,
    // query all active campaigns
    // compute if the states of any campaign should change
    // if campaign is successful, add it to payouts data array

    const campaigns = await prisma.campaign.findMany({
        where: {
            AND: {
                userId: {
                    equals: userId
                },
                status: {
                    equals: Status.ACTIVE
                }
            }
        }
    });

    if (!campaigns || campaigns.length <= 0) {
        return Response.json({payouts: [], failed: []}, {status: 200}); // user has no active campaigns
    }

    // get report from codeforces for this user
    // MOCKED IN THIS DEMO
    const problems = [
        { userId: 4, email: 'basillabib01@gmail.com', problemId: 101, datetime: '2023-07-04T10:00:00Z', status: 'solved' },
        { userId: 4, email: 'basillabib01@gmail.com', problemId: 105, datetime: '2023-07-04T10:00:00Z', status: 'solved' }
    ];

    // if user has solved numProblems for duration days then its success, else failed
    await prisma.campaign.update({
        where: {
            id: campaigns[0].id
        },
        data: {
            status: Status.SUCCESS
        }
    });

    await prisma.campaign.updateMany({
        where: {
            NOT: {
                id: {
                    equals: campaigns[0].id
                }
            }
        },
        data: {
            status: Status.FAIL
        }
    });

    // console.log(campaigns.slice(1));
    const failed = campaigns.slice(1);

    return Response.json({ payouts: campaigns[0], failed: failed}, { status: 200 });

}