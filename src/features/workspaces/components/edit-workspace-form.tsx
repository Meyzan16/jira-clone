"use client";

import { useFormik } from "formik";
import { updateWorkSpaceSchema } from "../schemas";
import { useContext } from "react";
import { GlobalContext } from "@/app/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DottedSeparator from "@/components/ui/dotted-separator";
import { createOrUpdateWorkSpaceControls } from "@/constants/workSpacesControls";
import { Button } from "@/components/ui/button";
import CircleLoader from "@/components/ui/circleloader";
import { useRouter } from "next/navigation";

import UploadImage from "@/components/ui/uploadImage";
import { Workspace } from "../types";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { getFormikError } from "@/lib/utils";
import { ArrowLeftIcon, CopyIcon } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import Input from "@/components/ui/input";
import { useResetInviteLink } from "../api/use-reset-invite-code";

interface editWorkSpaceFromProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const EditWorkSpaceForm = ({
  onCancel,
  initialValues,
}: editWorkSpaceFromProps) => {
  const router = useRouter();
  const { pageLevelLoader, setPageLevelLoader, setOpenAlert, componentLevelLoader, setComponentLevelLoader } = useContext(GlobalContext)!;

  const { mutate } = useUpdateWorkspace();
  const { mutate: deleteWorkspace } = useDeleteWorkspace();
  const { mutate: resetInviteCode } = useResetInviteLink();

  //hooks confirm
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "This action cannot be undone"
  );
  const [ResetDialog, confirmReset] = useConfirm(
    "Reset Invite Link",
    "This will invalidate the current invite link "
  );

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    setPageLevelLoader(true);
    deleteWorkspace(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      }
    );
  };

  const handleResetInviteCode = async () => {
    const ok = await confirmReset();
    if (!ok) return;
    setPageLevelLoader(true);
    resetInviteCode(
      {
        param: { workspaceId: initialValues.$id },
      }
    );
  };

  const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(fullInviteLink).then(() => {
      setOpenAlert({
        status: true,
        message: "invite link copied to the clipboard",
        severity: "success",
      });
    });
  };

  const formik = useFormik<Workspace>({
    initialValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
    validate: (values) => {
      const result = updateWorkSpaceSchema.safeParse(values);
      if (!result.success) {
        return result.error.flatten().fieldErrors;
      }
      return {};
    },
    onSubmit: (values) => {
      setComponentLevelLoader({loading: true, id: "save-changes"});
      mutate(
        { form: values, param: { workspaceId: initialValues.$id } },
        {
          onSuccess: () => {
            formik.resetForm();
          },
        }
      );
    },
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;


  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.$id}`)
            }
          >
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7 py-4">
          <DottedSeparator />
        </div>
        <CardContent className="px-7">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {createOrUpdateWorkSpaceControls.map((item, index) =>
              item.componentType === "input" ? (
                <Input
                  key={index}
                  id={item.id}
                  label={item.label}
                  type={item.type}
                  value={values[item.id as keyof typeof values]}
                  onChange={handleChange}
                  errors={
                    touched[item.id as keyof typeof values]
                      ? getFormikError(errors[item.id as keyof typeof values])
                      : undefined
                  }
                  touched={!!touched[item.id as keyof typeof values]}
                />
              ) : item.componentType === "file" ? (
                <UploadImage
                  key={index}
                  id={item.id}
                  label={item.label}
                  value={
                    values[item.id as keyof typeof values] as
                      | File
                      | string
                      | null
                  }
                  onChange={(file) => formik.setFieldValue(item.id, file)}
                />
              ) : null
            )}

            <DottedSeparator />

            <div className="flex items-center justify-between">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => onCancel?.()}
                className={onCancel ? "block" : "invisible"}
              >
                Cancel
              </Button>

              <Button
                size="md"
                variant="primary"
                type="submit"
                disabled={pageLevelLoader}
              >
                {componentLevelLoader.loading && componentLevelLoader.id === 'save-changes' ? <CircleLoader color={"#D3D3D3"} loading={true} /> : "Save Changes" }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add members to your workspace.
            </p>
            <div className="mt-4">
               <div className="flex items-center gap-2 w-full" >
                 <input className="py-4 px-2 w- full" disabled value={fullInviteLink} />
                 <Button
                    onClick={handleCopyInviteLink}
                    variant="secondary"
                    className="size-12"
                 >
                    <CopyIcon className="size-4" />
                 </Button>
               </div>
            </div>
            <DottedSeparator className="py-8" />
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              onClick={handleResetInviteCode}
            >
              Reset Invite Link
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irreversible and will remove all data
              associated .
            </p>
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              onClick={handleDelete}
              disabled={pageLevelLoader}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
