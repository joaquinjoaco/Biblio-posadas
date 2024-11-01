import prismadb from "@/lib/prismadb";

export const getLendingsCount = async (status: "activos" | "vencidos" | "devueltos" | "") => {
    // All lendings.
    let count = 0;

    if (status === 'activos') {
        // Currently active/pending lendings, books that are yet to be returned.
        count = await prismadb.prestamo.count({
            where: {
                fechaDevolucionFinal: null
            }
        });
    } else if (status === 'vencidos') {
        // Expired lendings, books that are yet to be returned after the agreed return date.
        const todayDate = new Date().setHours(0, 0, 0, 0);
        count = await prismadb.prestamo.count({
            where: {
                fechaDevolucionFinal: null,
                fechaDevolucionEstipulada: {
                    lt: new Date(todayDate)
                }
            }
        });
    } else if (status === 'devueltos') {
        // Returned books.
        count = await prismadb.prestamo.count({
            where: {
                fechaDevolucionFinal: {
                    not: null
                }
            }
        });
    } else {
        // count all lendings
        count = await prismadb.prestamo.count({});
    }

    return count;
}