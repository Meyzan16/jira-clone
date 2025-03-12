import { redirect } from "next/navigation";
import UserButton from "@/features/auth/components/user-button";
import { getCurrent } from "@/features/auth/actions";
import { CreateWorkSpaceForm } from "@/features/workspaces/components/create-workspace-form";

const Home = async () => {
  const user = await  getCurrent();

  if(!user) redirect("/sign-in");

  return (
    <div className="bg-neutral-200 p-4 h-full rounded-xl">
      <CreateWorkSpaceForm />
    </div>
  );
};

export default Home;
