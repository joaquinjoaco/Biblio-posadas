import prismadb from "@/lib/prismadb";

export const getBooksCount = async () => {
    // non archived books.
    const count = await prismadb.libro.count({
        where: {
            isArchived: false,
        }
    });

    return count;
}