"use client";

import CircleLoader from "@/components/ui/circleloader";

const DashboardLoading = () => {
    return (
        <div className="h-full min-h-screen flex items-center justify-center">
            <CircleLoader color={"#D3D3D3"} loading={true} />
        </div>
    )
}

export default DashboardLoading;