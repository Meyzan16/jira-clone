import { redirect } from "next/navigation";
import UserButton from "@/features/auth/components/user-button";
import { getCurrent } from "@/features/auth/actions";

const Home = async () => {
  const user = await  getCurrent();

  console.log({user});

  if(!user) redirect("/sign-in");


  return (
    <div className="my-8">
      <UserButton />
    </div>
  );
};

export default Home;
