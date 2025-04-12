"use client";

import { Button } from "@/components/ui/button";
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from "@/components/ui/card";
import DottedSeparator from "@/components/ui/dotted-separator";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { useGetMembers } from "../api/use-get-members";
import { Fragment } from "react";
import { MemberAvatar } from "./member-avatar";

export const MemberList = () => {
    const workspaceId = useWorkspaceId();
    const {data} = useGetMembers({ workspaceId });

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex flex-row items-center gap-4 p-7 space-y-0">
                <Button variant="secondary" size="sm" >
                    <Link href={`workspaces/${workspaceId}`} />
                    <ArrowLeftIcon className="size-4 mr-2" />
                    Back
                </Button>
                <CardTitle className="text-xl font-bold">
                    Member List
                </CardTitle>
            </CardHeader>
            <div className="p-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
                {data?.documents.map((member, index) => (
                    <Fragment key={member.$id}>
                        <div className="flex items-center gap-2">
                            <MemberAvatar
                                className="size-10"
                                fallbackClassName="text-lg"
                                name={member.name}
                            />
                            <div className="flex flex-col">
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                            <Button
                                className="ml-auto"
                                variant="secondary"
                                size="icon"
                            >
                                <MoreVerticalIcon className="size-4 text-muted-foreground" />
                            </Button>
                        </div>
                        {
                            index < data.documents.length - 1 && (
                                <DottedSeparator className="my-4" />
                            )
                        }
                    </Fragment>
                ))
            }
            </CardContent>
        </Card>
    )
}