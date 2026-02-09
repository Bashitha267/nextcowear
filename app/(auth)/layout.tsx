export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // No authentication check - this layout is for public auth pages
    return <>{children}</>;
}
