import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BellRing, Send } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useAppContext } from "@/context/app-context";
import { useSendReminder } from "@/modules/settings/hooks/useSettings";

const Settings = () => {
  const { isPanelUp } = useAppContext();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const sendReminder = useSendReminder();

  useEffect(() => {
    if (isPanelUp === false) {
      navigate("/maintenance");
    }
  }, [isPanelUp, navigate]);

  const handleConfirm = () => {
    sendReminder.mutate(undefined, {
      onSettled: () => setConfirmOpen(false),
    });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4 md:gap-5">
        <PageHeader
          title="Settings"
          description="Manage panel preferences and manual actions."
        />
        <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
          <div className="flex items-start gap-3.5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
              <BellRing className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-display text-base font-semibold text-on-surface">
                Send Reminder
              </h2>
              <p className="mt-0.5 text-xs leading-relaxed text-on-surface-variant">
                Trigger the panel reminder notification. You will be asked to
                confirm before anything is sent.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setConfirmOpen(true)}
            className="shrink-0 cursor-pointer"
          >
            <Send className="size-4" aria-hidden />
            <span>Send Reminder</span>
          </Button>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Send reminder?"
        description="This will trigger the panel reminder notification. Do you want to continue?"
        confirmLabel="Send Reminder"
        destructive={false}
        loading={sendReminder.isPending}
        onConfirm={handleConfirm}
      />
    </Layout>
  );
};

export default Settings;
