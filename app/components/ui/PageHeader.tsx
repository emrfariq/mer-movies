export default function PageHeader({ title }: { title: string }) {
    return (
        <div className="pt-32 pb-10 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-white border-l-4 border-purple-600 pl-4">
                    {title}
                </h1>
            </div>
        </div>
    );
}
