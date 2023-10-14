import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";


// isAdmin mocado para dev, alterar em prod
const isAdmin = true;

const AdminLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const { userId } = auth();

    if (!isAdmin) {
        return redirect("/");
    }

    return <>{children}</>
}

export default AdminLayout;