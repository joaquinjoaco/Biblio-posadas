'use client'

export default function Error() {
    return (
        <div className="absolute bg-transparent w-full min-h-screen pattern-wavy pattern-blue-100 pattern-bg-white dark:pattern-accent-foreground pattern-size-6 pattern-opacity-100 pb-[15%]">
            <div className="flex items-center justify-center min-h-screen">
                <div className="py-6 px-8 mx-4 max-w-[600px] rounded-2xl bg-destructive text-destructive-foreground">
                    <p className="font-semibold text-lg">
                        Ups!
                    </p>
                    <p>
                        Ocurrió un error inesperado.
                    </p>
                    <div className="my-2">
                        <p>Contáctate con el soporte.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}