import { useUser } from "@/components/shared/UserProvider";
import ChooseRole from "@/components/ChooseRole";

export default function ChooseRolePage() {
  const { user, loading } = useUser();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }
  if (!user) {
    return null;
  }
  return <ChooseRole userId={user.id} />;
}
