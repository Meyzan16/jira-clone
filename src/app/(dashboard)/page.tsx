import { redirect } from "next/navigation";
import UserButton from "@/features/auth/components/user-button";
import { getCurrent } from "@/features/auth/actions";

const Home = async () => {
  const user = await  getCurrent();

  if(!user) redirect("/sign-in");

  return (
    <div>
      This is a home page
    </div>
  );
};

export default Home;
