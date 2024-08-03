import { Member, Profile, Server } from "@prisma/client"
type ServerWithMembersWithProfiles=Server&{
    members:(Member &{profile:Profile})[]
}

export default  ServerWithMembersWithProfiles 