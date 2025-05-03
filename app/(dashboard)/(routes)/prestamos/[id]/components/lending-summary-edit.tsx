import { Libro, Socio } from "@prisma/client"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { BookOpen, Calendar, User } from "lucide-react"

interface LendingSummaryProps {
  book: Libro
  member: Socio
  fechaPrestado?: Date | null
  fechaDevolucionEstipulada?: Date | null
}

const LendingSummary: React.FC<LendingSummaryProps> = ({
  book,
  member,
  fechaPrestado,
  fechaDevolucionEstipulada,
}) => {
  // Calculate days remaining if both dates are available
  const daysRemaining = fechaPrestado && fechaDevolucionEstipulada ? Math.ceil((fechaDevolucionEstipulada.getTime() - fechaPrestado.getTime()) / (1000 * 60 * 60 * 24)) : null

  const formatDate = (date: Date | null) => {
    if (!date) return "No seleccionada"
    return format(date, "d 'de' MMMM, yyyy", { locale: es })
  }

  return (
    <div className="bg-white rounded-lg border border-amber-200 p-4 shadow-sm w-full max-w-xs">
      <h3 className="text-lg font-medium text-amber-800 border-b border-amber-100 pb-2 mb-3">Resumen del préstamo</h3>

      <div className="space-y-3">
        {/* Book info */}
        <div className="flex items-start gap-2">
          <BookOpen className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-amber-600 font-medium">Libro</p>
            <p className="text-sm">{book.titulo}</p>
          </div>
        </div>

        {/* Borrower info */}
        <div className="flex items-start gap-2">
          <User className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-amber-600 font-medium">Socio</p>
            <p className="text-sm">
              {member.nombre} {member.apellido}
            </p>
          </div>
        </div>

        {/* Date info */}
        {fechaPrestado && fechaDevolucionEstipulada ? (
          <div className="flex items-start gap-2">
            <Calendar className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <>
                <p className="text-xs text-amber-600 font-medium">Período de préstamo</p>
                <p className="text-sm">
                  {formatDate(fechaPrestado)} → {formatDate(fechaDevolucionEstipulada)}
                </p>
              </>

              {daysRemaining !== null && (
                <p
                  className={`text-sm mt-1 font-medium ${daysRemaining < 1 ? "text-red-500" : daysRemaining < 3 ? "text-amber-500" : "text-green-600"
                    }`}
                >
                  {daysRemaining < 0
                    ? `Vencido durante ${Math.abs(daysRemaining)} día${Math.abs(daysRemaining) > 1 ? "s" : ""}`
                    : daysRemaining === 0
                      ? "Vence el mismo día"
                      : `${daysRemaining} día${Math.abs(daysRemaining) > 1 ? "s" : ""}`}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <Calendar className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <>
                <p className="text-xs text-amber-600 font-medium">Período de préstamo</p>
                <p className="text-sm">
                  Selecciona las fechas
                </p>
              </>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default LendingSummary