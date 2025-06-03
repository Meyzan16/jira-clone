"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DottedSeparator from "@/components/ui/dotted-separator";
import Link from "next/link";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { useInviteCode } from "../hooks/use-invite-code";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";
import CircleLoader from "@/components/ui/circleloader";

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
  };
}

export const JoinWorkspaceForm = ({
  initialValues,
}: JoinWorkspaceFormProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const inviteCode = useInviteCode();
  const { mutate } = useJoinWorkspace();
  const { pageLevelLoader, setPageLevelLoader, setOpenAlert } = useContext(GlobalContext)!;

  const onSubmit = () => {
    setPageLevelLoader(true);
    mutate(
      {
        param: { workspaceId },
        json: { code: inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription className="text-muted-foreground">
          You&apos;ve Enter the invite code to join {" "}
          <strong>{initialValues.name}.</strong>
        </CardDescription>
      </CardHeader>
      <div className="p-8">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row gap-y-2 gap-x-2 items-center justify-between">
          <Button
            variant="secondary"
            type="button"
            size="lg"
            className="w-full lg:w-fit"
          >
            <Link href="/">Cancel</Link>
          </Button>
          <Button
            size="lg"
            variant="primary"
            className="w-full lg:w-fit"
            type="button"
            onClick={onSubmit}
            disabled={pageLevelLoader}
          >
             {pageLevelLoader === true ? (
                <CircleLoader color={"#ffffff"} loading={pageLevelLoader} />
              ) : (
                "Join"
              )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
