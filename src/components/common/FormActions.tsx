import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isPending: boolean;
  pendingLabel: string;
  submitLabel: string;
  backTo?: string;
  backLabel?: string;
}

function FormActions({ isPending, pendingLabel, submitLabel, backTo, backLabel = "Back" }: FormActionsProps) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="animate-spin" /> : <Send />}
        <span>{isPending ? pendingLabel : submitLabel}</span>
      </Button>
      {backTo ? (
        <Button variant="outline" asChild>
          <Link to={backTo}>
            <ArrowLeft />
            <span>{backLabel}</span>
          </Link>
        </Button>
      ) : null}
    </div>
  );
}

export { FormActions };
