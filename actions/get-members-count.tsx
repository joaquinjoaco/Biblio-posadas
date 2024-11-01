import prismadb from "@/lib/prismadb";

export const getMembersCount = async () => {
    // non archived members.
    const count = await prismadb.socio.count({
        where: {
            isArchived: false,
        }
    });

    return count;
}