import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="absolute bg-transparent w-full min-h-screen pattern-wavy pattern-blue-100 pattern-bg-white dark:pattern-accent-foreground pattern-size-6 pattern-opacity-100">
            <div className="flex items-center justify-center min-h-screen">
                <div className="py-6 px-8 mx-4 max-w-[600px] rounded-2xl bg-destructive text-destructive-foreground">
                    <p className="font-semibold text-lg">
                        Ups!
                    </p>
                    <p>
                        No se encontró lo que buscabas.
                    </p>
                    <div className="my-2">
                        <Link className="underline" href="/">Volver al panel</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}