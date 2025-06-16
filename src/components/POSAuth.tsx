
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface POSAuthProps {
  onAuthenticated: () => void;
}

const POS_PASSWORD = 'pos123'; // Default POS password

export const POSAuth = ({ onAuthenticated }: POSAuthProps) => {
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === POS_PASSWORD) {
      onAuthenticated();
      toast({
        title: "Welcome to BrintoPOS",
        description: "POS system ready for operation",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password",
        variant: "destructive",
      });
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-orange-500 text-white rounded-lg flex items-center justify-center mb-4">
            <Receipt className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">BrintoPOS</CardTitle>
          <p className="text-gray-600">Enter password to access POS system</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter POS password"
                className="mt-1"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
              Access POS
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Default password: pos123
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
