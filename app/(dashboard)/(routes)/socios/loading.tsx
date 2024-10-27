import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <div className="flex flex-col w-full h-full p-8 gap-y-8 ">
            <Skeleton className="w-full aspect-square rounded-xl md:aspect-[8/0.8]" />
            <div className="flex flex-col gap-y-4">
                <Skeleton className="max-w-[400px] h-[50px] rounded-xl" />
                <Skeleton className="w-full h-[500px] rounded-xl" />
                <Skeleton className="w-[200px] h-[50px] rounded-xl ml-auto" />
            </div>
        </div>
    );
}

export default Loading;