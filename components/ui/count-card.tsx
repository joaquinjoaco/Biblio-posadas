import { Card, CardContent } from "@/components/ui/card"

export default function CountCard({
  title,
  desc,
  count,
  icon,
}: {
  title: string,
  desc?: string,
  count: number,
  icon: React.ReactNode,
}) {
  return (
    <Card className="w-full md:max-w-md overflow-hidden transition-all hover:shadow-lg">
      <div className="flex items-center">
        <div className="w-2 self-stretch bg-gradient-to-b from-orange-400 to-orange-600"></div>
        <CardContent className="flex-1 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {title}
            </h2>
            <p className="flex text-2xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
              {count}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {desc}
            </p>
          </div>
          <div className="ml-4">
            {icon}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}