import prismadb from "@/lib/prismadb";
import { MemberForm } from "./components/member-form";
import { Header } from "@/components/ui/header";
const MemberPage = async (
    props: {
        params: Promise<{ id: string }>
    }
) => {
    const params = await props.params;

    const { id } = await params // From Next 15 on, params API is now asynchronous (https://nextjs.org/docs/messages/sync-dynamic-apis).
    const numeroId = id === 'nuevo' ? -1 : params.id

    const member = await prismadb.socio.findUnique({
        where: {
            id: Number(numeroId)
        }
    })


    const breadcrumbs = [
        {
            name: `Socios`,
            url: '/socios'
        },
        {
            name: member ? `${member?.nombre} ${member?.apellido}` : 'Nuevo socio',
            url: `/socios/${id}`
        }
    ]

    return (
        <>
            {/* Header with breadcrumbs and Sidebar trigger */}
            <Header breadcrumbs={breadcrumbs} withSideBarTrigger />
            <div className="flex-col">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <MemberForm initialData={member} />
                </div>
            </div>
        </>
    );
}

export default MemberPage;