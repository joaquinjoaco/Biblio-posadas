import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Filter, ListRestartIcon, TableOfContents } from "lucide-react";
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select";

interface LendingsDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function LendingsDataTable<TData, TValue>({
    columns,
    data,
}: LendingsDataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [selectedColumn, setSelectedColumn] = useState<string>(columns[1]?.id || "Nº de préstamo"); // Default to the second column (because the first one has cellActions)

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
        initialState: {
            pagination: {
                pageSize: 5, // Default page size
            }
        }
    })

    // Reset the filter value whenever the selected column changes.
    useEffect(() => {
        table.getColumn(selectedColumn)?.setFilterValue("");
    }, [selectedColumn]);

    return (
        <div>
            {/* Filter by column */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex items-center space-x-2">
                    <TooltipWrapper
                        content="Cambiar filtro"
                        icon={<Filter className="h-4 w-4" />}
                        className="flex flex-row items-center gap-x-2"
                    >
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button >
                                    <Filter className="w-6 h-6 mr-2" /> {capitalizeFirstLetter(selectedColumn) || "Filtro"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table.getAllColumns().map((column) => (
                                    column.id !== "isArchivedText" && column.id !== "actions" && column.id !== "Devolución" ?
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

                {/* Pagination buttons */}
                <div className="flex items-center space-x-2">
                    <Select
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                        defaultValue="5"
                    >
                        <SelectTrigger className="mr-2">
                            <SelectValue placeholder="Cantidad de filas" />
                        </SelectTrigger>
                        <SelectContent className="px-2">
                            <SelectGroup>
                                <SelectLabel className="pl-0 flex items-center gap-x-2">
                                    <TableOfContents className="w-4 h-4" />
                                    Cantidad de filas
                                </SelectLabel>
                                <SelectItem value="5">5 filas</SelectItem>
                                <SelectItem value="10">10 filas</SelectItem>
                                <SelectItem value="15">15 filas</SelectItem>
                                <SelectItem value="20">20 filas</SelectItem>
                                <SelectItem value="25">25 filas</SelectItem>
                                <SelectItem value="30">30 filas</SelectItem>
                                <SelectItem value="35">35 filas</SelectItem>
                                <SelectItem value="40">40 filas</SelectItem>
                                <SelectItem value="45">45 filas</SelectItem>
                                <SelectItem value="50">50 filas</SelectItem>
                                <SelectItem value="55">55 filas</SelectItem>
                                <SelectItem value="60">60 filas</SelectItem>
                                <SelectItem value="65">65 filas</SelectItem>
                                <SelectItem value="70">70 filas</SelectItem>
                                <SelectItem value="75">75 filas</SelectItem>
                                <SelectItem value="80">80 filas</SelectItem>
                                <SelectItem value="85">85 filas</SelectItem>
                                <SelectItem value="90">90 filas</SelectItem>
                                <SelectItem value="95">95 filas</SelectItem>
                                <SelectItem value="100">100 filas</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Siguiente
                    </Button>
                </div>

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
        </div>
    );
}
