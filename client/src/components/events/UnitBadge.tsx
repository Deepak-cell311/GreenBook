import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Unit } from "@shared/schema";

interface UnitBadgeProps {
  unitId: number;
}

export default function UnitBadge({ unitId }: UnitBadgeProps) {
  const { data: unit, isLoading, isError } = useQuery<Unit | null>({
    queryKey: ["/api/units", unitId],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", `/api/units/${unitId}`);
        if (!res.ok) {
          if (res.status === 404) {
            return null; // Return null if not found, don't treat as an error
          }
          throw new Error("Failed to fetch unit");
        }
        return res.json();
      } catch (error) {
        console.error(`Failed to fetch unit ${unitId}:`, error);
        return null; // Return null on other errors too
      }
    },
    enabled: !!unitId,
  });

  if (isLoading) {
    return <Badge variant="outline">Loading...</Badge>;
  }

  if (isError || !unit) {
    return <Badge variant="destructive">Unknown Unit</Badge>;
  }

  return (
    <Badge variant="outline">
      {unit.name}
    </Badge>
  );
} 