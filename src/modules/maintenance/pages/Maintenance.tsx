import { Link } from "react-router-dom";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Maintenance = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-dim p-4 text-on-surface md:p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
            <Construction className="size-7" />
          </span>
          <CardTitle>Maintenance Mode</CardTitle>
          <CardDescription>The panel is currently down for maintenance. Please try again later.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild variant="primary">
            <Link to="/">Back to Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Maintenance;
