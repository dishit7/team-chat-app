// pages/api/socket/messages/index.ts
import { currentProfile } from "@/lib/current-profile-pages"
import { db } from "@/lib/db"
import { NextApiRequest, NextApiResponse } from "next"
import { Message } from "@prisma/client"
import { NextApiResponseServerIo } from "@/types";
import { RESPONSE_LIMIT_DEFAULT } from "next/dist/server/api-utils";
import { emit } from "process";
 
export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    // Handle the request based on the HTTP method
    if (req.method === 'POST') {
        return handlePost(req, res);
    } else if (req.method === 'GET') {
        return handleGet(req, res);
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// POST handler
async function handlePost(req: NextApiRequest, res: NextApiResponseServerIo) {
    try {
        const profile = await currentProfile(req);
        if (!profile) {
            return res.status(400).json({ message: "Unauthorized" });
        }

        const body = req.body;
        const { content, fileUrl } = body;
        const serverId = req.query.serverId as string;
        const channelId = req.query.channelId as string;

        console.log(`NEW the body is ${JSON.stringify({ body })}`);
        console.log(`serverid and channels id are ${serverId} ${channelId}`);
        console.log(`the file url is ${JSON.stringify(fileUrl)} and server id is ${serverId} those uploads right`);

        if (!content) {
            return res.status(400).json({ message: "Content is missing" });
        }
        if (!serverId) {
            return res.status(450).json({ message: "ServerId is missing" });
        }
        if (!channelId) {
            return res.status(400).json({ message: "ChannelId is missing" });
        }

        const server = await db.server.findFirst({
            where: {
                id: serverId,
                members: { some: { profileId: profile.id } }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    }
                }
            }
        });
        const channel = await db.channel.findFirst({
            where: {
                id: channelId,
                serverId: serverId
            }
        });

        const member = server?.members.find((member: any) => member.profileId === profile.id);

        if (member) {
            const message = await db.message.create({
                data: {
                    content,
                    fileUrl,
                    channelId: channelId,
                    memberId: member?.id
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            });

            const channelKey = `chat:${channelId}:messages`;
            console.log(`CHANNEL ID WHICH WE ARE EMITTING IS ${channelKey}`)
            res?.socket?.server?.io?.emit("newMessage")
            res?.socket?.server?.io?.emit(channelKey,message)
            
             return res.json(message);
        }
       
    } catch (err) {
        console.log("[SOCKET POST MESSAGES ERROR]", err);
        
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// GET handler
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    try {
        const MESSAGES_BATCH = 10;
        const profile = await currentProfile(req);
        if (!profile) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { cursor, channelId } = req.query;

        if (!channelId) {
            return res.status(400).json({ message: "ChannelId is missing" });
        }

        console.log(`ChannelId in socket messages GET is ${channelId}`);

        let messages: Message[] = [];

        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor as string
                },
                where: {
                    channelId: {
                        equals: channelId as string,
                        mode: 'insensitive'  // Case-insensitive search
                    }
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
        } else {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                where: {
                    channelId: {
                        equals: channelId as string,
                        mode: 'insensitive'
                    }
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
        }

        let nextCursor = null;
        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[MESSAGES_BATCH - 1].id;
        }

        console.log(`Messages: ${messages[0]?.content}, length: ${messages.length}`);
        return res.json({
            items: messages,
            nextCursor
        });
       
    } catch (err) {
        console.log("[SOCKET MESSAGES GET ERROR]", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
