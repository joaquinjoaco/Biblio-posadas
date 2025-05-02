import prismadb from "./prismadb";

const lendings_api = {
    lendings: {
        active: async (memberId?: number) => {
            // Returns all active lendings from a member or every active lending if no memberId is provided.
            if (memberId) {
                return await prismadb.prestamo.findMany({
                    where: {
                        idSocio: memberId,
                        fechaDevolucionFinal: null
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                })
            } else {
                return await prismadb.prestamo.findMany({
                    where: {
                        fechaDevolucionFinal: null
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                })
            }
        },
        expired: async (memberId?: number) => {
            // Returns all expired lendings from a member or every expired lending if no memberId is provided.
            const todayDate = new Date().setHours(0, 0, 0, 0);
            if (memberId) {
                return await prismadb.prestamo.findMany({
                    where: {
                        idSocio: memberId,
                        fechaDevolucionFinal: null,
                        fechaDevolucionEstipulada: {
                            lte: new Date(todayDate)
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                })
            } else {
                return await prismadb.prestamo.findMany({
                    where: {
                        fechaDevolucionFinal: null,
                        fechaDevolucionEstipulada: {
                            lte: new Date(todayDate)
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                })
            }
        },
        returned: async (memberId?: number) => {
            // Returns all returned lendings from a member or every returned lending if no memberId is provided.
            if (memberId) {
                return await prismadb.prestamo.findMany({
                    where: {
                        idSocio: memberId,
                        fechaDevolucionFinal: {
                            not: null
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                })
            } else {
                return await prismadb.prestamo.findMany({
                    where: {
                        fechaDevolucionFinal: {
                            not: null
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                })
            }
        },
        all: async (memberId?: number) => {
            if (memberId) {
                return await prismadb.prestamo.findMany({
                    where: {
                        idSocio: memberId
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                })
            } else {
                return await prismadb.prestamo.findMany({
                    orderBy: {
                        createdAt: 'desc'
                    }
                })
            }
        }
    }
};

export default lendings_api;