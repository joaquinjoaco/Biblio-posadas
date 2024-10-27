import prismadb from "@/lib/prismadb";
import { MemberForm } from "./components/member-form";
const MemberPage = async (
    props: {
        params: Promise<{ id: string }>
    }
) => {
    const params = await props.params;

    const { id } = await params // From Next 15 on, params API is now asynchronous (https://nextjs.org/docs/messages/sync-dynamic-apis).
    const numeroId = id === 'nuevo' ? -1 : params.id

    const socio = await prismadb.socio.findUnique({
        where: {
            id: Number(numeroId)
        }
    })


    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <MemberForm initialData={socio} />
            </div>
        </div>
    );
}

export default MemberPage;