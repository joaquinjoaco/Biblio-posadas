import prismadb from "@/lib/prismadb";
import { DriverForm } from "./components/driver-form";

const SizePage = async ({
    params
}: {
    params: { phone: string }
}) => {

    const driver = await prismadb.driver.findUnique({
        where: {
            phone: params.phone
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <DriverForm initialData={driver} />
            </div>
        </div>
    );
}

export default SizePage;