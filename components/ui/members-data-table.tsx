import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Filter, ListRestartIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { TooltipWrapper } from "./tooltip-wrapper";
import { capitalizeFirstLetter } from "@/lib/utils";

interface MembersDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function MembersDataTable<TData, TValue>({
    columns,
    data,
}: MembersDataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [selectedColumn, setSelectedColumn] = useState<string>(columns[1]?.id || "ID"); // Default to the first column

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            columnFilters,
            sorting,
            columnVisibility,
        },
    });

    // Reset the filter value whenever the selected column changes.
    useEffect(() => {
        table.getColumn(selectedColumn)?.setFilterValue("");
    }, [selectedColumn]);

    return (
        <div>
            {/* Filter by column */}
            <div className="flex items-center py-4 space-x-2">
                <TooltipWrapper
                    content="Cambiar filtro"
                    icon={<Filter className="h-4 w-4" />}
                    className="flex flex-row items-center gap-x-2"
                >
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button>
                                <Filter className="w-6 h-6 mr-2" /> {capitalizeFirstLetter(selectedColumn) || "Filtro"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table.getAllColumns().map((column) => (
                                column.id !== "isArchivedText" && column.id !== "actions" ?
                                    <DropdownMenuItem
                                        key={column.id}
                                        onClick={() => setSelectedColumn(column.id)}
                                        className="cursor-pointer"
                                    >
                                        {capitalizeFirstLetter(column.id)}
                                    </DropdownMenuItem>
                                    :
                                    ""
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TooltipWrapper>
                {/*
                 Reload button: (this is like a workaround)
                    Necessary to improve UX because when you swap the selected column
                    without erasing the input's content it won't behave as expected,
                    so, the user now has this little 'tool' at hand. Because I couldn't
                    come up with a better workaround or solution
                */}
                <TooltipWrapper
                    content="Recargar filtro"
                    icon={<ListRestartIcon className="h-4 w-4" />}
                    className="flex flex-row items-center gap-x-2"
                >
                    {/* Had to use a div because TooltipTrigger is also a button and buttons are not to be nested on eachother */}
                    <Button
                        onClick={() => { window.location.reload() }}
                        size={"icon"}
                        variant={"outline"}
                    >
                        <ListRestartIcon className="h-6 w-6" />
                    </Button>
                </TooltipWrapper>
                <Input
                    placeholder={`Buscar por ${selectedColumn}`}
                    value={(table.getColumn(selectedColumn)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(selectedColumn)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>

            {/* Table */}
            <div className="rounded-md border shadow-lg">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No se encontraron resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Anterior
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Siguiente
                </Button>
            </div>
        </div>
    );
}
