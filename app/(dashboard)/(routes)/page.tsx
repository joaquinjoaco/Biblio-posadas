import { getBooksCount } from "@/actions/get-books-count";
import { getLendingsCount } from "@/actions/get-lendings-count";
import { getMembersCount } from "@/actions/get-members-count";
import GridBackground from "@/components/grid-background";
import CountCard from "@/components/ui/count-card";
import { TooltipWrapper } from "@/components/ui/tooltip-wrapper";
import { ArrowUpRight, Book, BookUp2, Handshake, Timer, User } from "lucide-react";
import Link from "next/link";

const DashboardPage = async () => {

    const booksCount = await getBooksCount()
    const membersCount = await getMembersCount()
    const allLendingsCount = await getLendingsCount("")
    const expiredLendingsCount = await getLendingsCount("vencidos")
    const activeLendingsCount = await getLendingsCount("activos")
    const returnedLendingsCount = await getLendingsCount("devueltos")

    return (
        <>
            <div className="-z-10 absolute top-0 left-0 w-full h-full overflow-hidden">
                <div
                    className="absolute inset-0 h-full w-full opacity-20"
                    style={{
                        backgroundImage: `
            linear-gradient(to right, rgba(255, 130, 0, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 130, 0, 0.5) 1px, transparent 1px)
          `,
                        backgroundSize: "20px 20px",
                    }}
                />
            </div>
            <div className="flex flex-col sm:flex-row gap-x-8 p-8 mt-8">
                <div className="flex flex-col gap-y-8">
                    <TooltipWrapper
                        content='Ver libros'
                        icon={<ArrowUpRight className="h-4 w-4" />}
                        className="flex items-center gap-x-2"
                    >
                        <Link
                            href={'/libros'}
                        >
                            <CountCard
                                title="Libros registrados"
                                count={booksCount}
                                icon={<Book className="w-10 h-10 text-orange-500 dark:text-orange-400" />}
                            />
                        </Link>
                    </TooltipWrapper>
                    <TooltipWrapper
                        content='Ver socios'
                        icon={<ArrowUpRight className="h-4 w-4" />}
                        className="flex items-center gap-x-2"
                    >
                        <Link
                            href={'/socios'}
                        >
                            <CountCard
                                title="Socios registrados"
                                count={membersCount}
                                icon={<User className="w-10 h-10 text-orange-500 dark:text-orange-400" />}
                            />
                        </Link>
                    </TooltipWrapper>
                </div>
                <div className="flex flex-col gap-y-8">
                    <TooltipWrapper
                        content='Ver préstamos'
                        icon={<ArrowUpRight className="h-4 w-4" />}
                        className="flex items-center gap-x-2"
                    >
                        <Link
                            href={'/prestamos'}
                        >
                            <CountCard
                                title="Todos los préstamos"
                                count={allLendingsCount}
                                icon={<Handshake className="w-10 h-10 text-orange-500 dark:text-orange-400" />}
                            />
                        </Link>
                    </TooltipWrapper>
                    <TooltipWrapper
                        content='Ver préstamos activos'
                        icon={<ArrowUpRight className="h-4 w-4" />}
                        className="flex items-center gap-x-2"
                    >
                        <Link
                            href={'/prestamos?status=activos'}
                        >
                            <CountCard
                                title="Préstamos activos"
                                count={activeLendingsCount}
                                icon={<BookUp2 className="w-10 h-10 text-orange-500 dark:text-orange-400" />}
                            />
                        </Link>
                    </TooltipWrapper>
                    <TooltipWrapper
                        content='Ver préstamos vencidos'
                        icon={<ArrowUpRight className="h-4 w-4" />}
                        className="flex items-center gap-x-2"
                    >
                        <Link
                            href={'/prestamos?status=vencidos'}
                        >
                            <CountCard
                                title="Préstamos vencidos"
                                count={expiredLendingsCount}
                                icon={<Timer className="w-10 h-10 text-orange-500 dark:text-orange-400" />}
                            />
                        </Link>
                    </TooltipWrapper>
                    <TooltipWrapper
                        content='Ver préstamos devueltos'
                        icon={<ArrowUpRight className="h-4 w-4" />}
                        className="flex items-center gap-x-2"
                    >
                        <Link
                            href={'/prestamos?status=devueltos'}
                        >
                            <CountCard
                                title="Préstamos devueltos"
                                count={returnedLendingsCount}
                                icon={<Handshake className="w-10 h-10 text-orange-500 dark:text-orange-400" />}
                            />
                        </Link>
                    </TooltipWrapper>
                </div>
            </div>
        </>
    );
}

export default DashboardPage;