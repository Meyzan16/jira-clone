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
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { useGetMembers } from "../api/use-get-members";
import { Fragment } from "react";
import { MemberAvatar } from "./member-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteMember } from "../api/use-delete-member";
import { useUpdateMember } from "../api/use-update-member";
import { MemberRole } from "../types";
import { useConfirm } from "@/hooks/use-confirm";

export const MemberList = () => {
  const workspaceId = useWorkspaceId();
  const  [ConfirmDialog, Confirm] = useConfirm(
    "Remove member",
    "This member will be removed from the workspace"
  )
  const { data } = useGetMembers({ workspaceId });

  const {mutate : deleteMember} = useDeleteMember();
  const {mutate : updateMember} = useUpdateMember();

  const handleUpdateMember = (memberId: string, role:MemberRole) => {
    updateMember({
        json: { role },
        param : {memberId},
    })
  }

  const handleDeleteMember = async (memberId: string) => {
    const ok = await Confirm();
    if(!ok) return;

    deleteMember({param: {memberId} }, {
        onSuccess: () => {
            window.location.reload();
        }
    })
  }

  const href = `/workspaces/${workspaceId}`;


  return (
    <Card className="w-full h-full border-none shadow-none">
        <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-4 p-7 space-y-0">
        <Button variant="secondary" size="sm">
          <Link href={href} className="flex items-center gap-2">
              <ArrowLeftIcon className="size-4 mr-2" />
              Back
          </Link>

        </Button>
        <CardTitle className="text-xl font-bold">Member List</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {data?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2 justify-between">
              <MemberAvatar
                className="size-10"
                fallbackClassName="text-lg"
                name={member.name}
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name} {member.role}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button className="ml-auto" variant="secondary" size="icon">
                    <MoreVerticalIcon className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() => handleUpdateMember(member.$id , MemberRole.ADMIN)}
                    // disabled = {false}
                  >
                    Set as administrator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() =>  handleUpdateMember(member.$id , MemberRole.MEMBER)}
                    // disabled = {false}
                  >
                    Set as member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium text-amber-700"
                    onClick={() => handleDeleteMember(member.$id)}
                    // disabled = {false}
                  >
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
            {index < data.documents.length - 1 && (
              <DottedSeparator className="my-4" />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
