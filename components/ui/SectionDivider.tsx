export default function SectionDivider() {
    return (
        <div className="relative h-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full" />
        </div>
    );
}
