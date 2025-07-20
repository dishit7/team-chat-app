// pages/api/socket/direct-messages/index.ts
import { db } from "@/lib/db"
import { currentProfile } from "@/lib/current-profile-pages"
import { NextApiRequest, NextApiResponse } from "next"
import { NextApiResponseServerIo } from "@/types"
import { DirectMessage } from "@prisma/client"
 import { redirect } from "next/navigation"
 
// Main handler for direct messages
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

async function handlePost(req: NextApiRequest, res: NextApiResponseServerIo) {
    try {
        const profile = await currentProfile(req);
        if (!profile) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log(`profle found`)
        const { content, fileUrl } = req.body;
        if (!content || !profile.id) {
            return res.status(400).json({ message: "Content or memberId is missing" });
        }
        console.log(`content and profileid found `)

        const conversationId = req.query.conversationId as string;
        const conversation = await db.conversation.findUnique({
            where: { id: conversationId }
        });

        if (!conversation) {
            return res.status(401).json({ message: "Conversation doesn't exist" });
        }
        console.log(`convrsation found`)
        // Check if member exists
        const memberExists = await db.member.findFirst({
            where: { profileId:profile.id }
        });
         
      if(!memberExists)
      {
        console.log(`member not exist`)
        return res.status(400).json({ message: "Member doesn't exist" });

      }
      console.log(`member   exist`)

        const message = await db.directMessage.create({
            data: {
                content,
                fileUrl,
                memberId: memberExists.id,
                conversationId: conversation.id,
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });
        console.log(`message was created`)
        const conversationKey = `chat:${conversation.id}:messages`;
        res.socket?.server?.io?.emit(conversationKey, message);

        return res.json(message);
    } catch (err) {
        console.error("[DIRECT MESSAGE POST ERROR]", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


// GET handler for retrieving direct messages
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    try {
        const profile = await currentProfile(req);
        if (!profile) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { conversationId, cursor } = req.query;

        if (!conversationId) {
            return res.status(400).json({ message: "ConversationId is missing" });
        }

        const MESSAGES_BATCH = 10;

        let messages: DirectMessage[] = [];
        if (cursor) {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: { id: cursor as string },
                where: { conversationId: conversationId as string },
                include: { member: { include: { profile: true } } },
                orderBy: { createdAt: "desc"  } as any,
            });
        } else {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                where: { conversationId: conversationId as string },
                include: { member: { include: { profile: true } } },
                orderBy: { createdAt: "desc" } as any
            });
        }

        let nextCursor = null;
        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[MESSAGES_BATCH - 1].id;
        }

        return res.json({ items: messages, nextCursor });
    } catch (err) {
        console.error("[DIRECT MESSAGE GET ERROR]", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
