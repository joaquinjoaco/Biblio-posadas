import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "./theme-toggle";
import QuickActions from "./quick-actions";

const Navbar = async () => {
    return (
        <div className="rounded-md shadow-md border-b bg-background">
            <div className="flex h-16 items-center px-4" >
                <MainNav />
                {/* Prestar / Devolver */}
                <div className="group flex hover:bg-orange-200/50 dark:hover:bg-orange-400/50 bg-gradient-to-b from-muted/50 transition-colors duration-500 ml-16 py-1 pl-2 pr-1 rounded-md items-center gap-x-2">
                    <div className="text-sm text-muted-foreground select-none mr-2 group-hover:text-black dark:group-hover:text-white transition-colors duration-500">
                        Acciones rápidas
                    </div>
                    <QuickActions />
                </div>
                <div className="ml-auto flex items-center space-x-4 ">
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );
}

export default Navbar;
