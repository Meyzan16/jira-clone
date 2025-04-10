import { useState } from "react";
import { Button  } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Card, CardContent,CardDescription ,CardHeader, CardTitle } from "@/components/ui/card";
import { resolve } from "path";
import { set } from "zod";


export const useConfirm = (
    title: string,
    message: string
): [() => JSX.Element , () => Promise<unknown>] => {
    const[promise, setPromise] = useState<{ resolve: (value: boolean) =>void } | null>(null);

    const confirm = () => {
        return new Promise((resolve) => {
            setPromise({ resolve });
        })
    }

    const handleClose = () => {
       setPromise(null);
    }

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose
    }

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    }

    const ConfirmationDialog = () => (

        <ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
            <Card className="w-full h-full border-none shadow-none">
                <CardContent>
                    <CardHeader className="p-0">
                        <CardTitle>
                            {title}
                        </CardTitle>
                        <CardDescription>
                            {message}
                        </CardDescription>
                    </CardHeader>
                    <div className="pt-4 w-full flex flex-col gap-y-2 md:flex-row gap-x-2 items-center justify-end">
                        <Button onClick={handleCancel} variant="outline" size="lg" className="w-full lg:w-auto">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} variant="destructive" size="lg" className="w-full lg:w-auto">
                            Confirm
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </ResponsiveModal>
)
    return [ConfirmationDialog, confirm]
    
}