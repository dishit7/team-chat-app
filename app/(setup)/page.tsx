 import InitialModal from "@/components/modals/intital-modal";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await initialProfile();
  console.log('Fetched profile:', profile); // Debugging log

  if (!profile || !profile.id) {
    // Handle the case where profile is undefined or doesn't have an id
    return ( redirect("/sign-up")
    );
  }

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

   if (server) {
   return redirect(`/servers/${server.id}`);
   }

  return (
    <div>
      <h1>Welcome to the Setup Page</h1>
      <InitialModal />
    </div>
  );
};

export default SetupPage;
