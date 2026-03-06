import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserCheck, KeyRound } from "lucide-react";

interface EmployeePinEntryProps {
  open: boolean;
  onClose: () => void;
  onVerified: (employee: { id: string; name: string }) => void;
  employees: { id: string; name: string; pin: string }[];
}

const EmployeePinEntry = ({ open, onClose, onVerified, employees }: EmployeePinEntryProps) => {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const match = employees.find(
      (emp) => emp.name.toLowerCase() === name.trim().toLowerCase() && emp.pin === pin
    );

    if (match) {
      onVerified({ id: match.id, name: match.name });
      setName("");
      setPin("");
    } else {
      setError("Invalid name or PIN. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Employee Verification
          </DialogTitle>
          <DialogDescription>Enter your name and PIN to continue</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emp-name">Name</Label>
            <Input
              id="emp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emp-pin">PIN</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="emp-pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="pl-10"
                maxLength={6}
                required
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">Verify & Continue</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeePinEntry;
