import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
    req: Request,
) {
    //   const id = await createItem(data)
    //   res.status(200).json({ id })

    // const data = await req.body?.json();
    // const data = await req.json();
    const formData = await req.formData();

    // console.log(formData.keys());

    // TODO: fomr value validation using zod

    const name = formData.get("name");
    const numProblems = Number(formData.get("numProblems"))
    const targetDuration = Number(formData.get("targetDuration"))
    const cfHandle = formData.get("cfHandle")
    const pledgedAmount = Number(formData.get("pledgedAmount"))
    const pledgeCurrency = formData.get("pledgeCurrency")
    const userId = formData.get("userId")

    // try {
        if (userId) {
            // const userWhereUniqueInput: Prisma.UserWhereUniqueInput = await prisma.user.findUnique({
            //     where: {
            //         id: userId
            //     }
            // });

            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            });

            if (!user) {
                throw new Error("User with given UserID doesn't exist!");
            }


            const newCampaign = await prisma.campaign.create({
                data: {
                    name: name,
                    numProblems: numProblems,
                    targetDuration: targetDuration,
                    cfHandle: cfHandle,
                    pledgedAmount: pledgedAmount,
                    pledgeCurrency: pledgeCurrency,
                    userId: userId,
                    // user: user
                }
            });
        
            // create a new campaign object for the logged user
            return Response.json({ message: "New Campaign created successfully!", data: newCampaign });
        } else {
            throw new Error("userId not provided!")
        }
    // } catch (error) {
    //     return Response.json({ message: error.message}, { status: 501});
    // }

}

export async function GET(
    req: Request
) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const userId = searchParams.get("userId");

    // console.log("debug, got userid", userId);
    const userIdForPrisma: string | Prisma.StringFilter<"Campaign"> | undefined = userId ?? undefined;
    try {
        const campaigns = await prisma.campaign.findMany({
            where: {
                userId: userIdForPrisma
            }
        });
        // console.log("debug, campaigns", campaigns);
        return Response.json({
            campaigns: campaigns
        })
    } catch (error) {
        return Response.json({
            message: "Something went wrong on the server, try again!"
        }, { status: 501 });
    }
}


export async function DELETE(
    req: Request
) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const campaignId = searchParams.get("campaignId");

    // console.log("debug, got userid", userId);
    const campaignIdForPrisma: string | Prisma.StringFilter<"Campaign"> | undefined = campaignId ?? undefined;
    try {
        const deleted = await prisma.campaign.delete({
            where: {
                id: campaignIdForPrisma
            }
        });
        // console.log("debug, campaigns", campaigns);
        return Response.json({
            deletedCampaign: deleted
        })
    } catch (error) {
        return Response.json({
            message: "Something went wrong on the server while trying to delete campaign, try again!"
        }, { status: 501 });
    }
}
