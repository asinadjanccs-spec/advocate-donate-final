import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Auth = () => {
  const [userType, setUserType] = useState("");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">Bridge Needs</span>
          </div>
          <CardTitle>Join Our Community</CardTitle>
          <CardDescription>
            Connect with causes that matter and make a real difference
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <div className="space-y-2">
                <Input placeholder="Email address" type="email" />
                <Input placeholder="Password" type="password" />
              </div>
              <Button className="w-full" variant="default">
                Sign In
              </Button>
              <div className="text-center text-sm">
                <a href="#" className="text-primary hover:underline">
                  Forgot your password?
                </a>
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-4">
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger>
                    <SelectValue placeholder="I want to join as..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual Donor</SelectItem>
                    <SelectItem value="nonprofit">Non-Profit Organization</SelectItem>
                    <SelectItem value="business">Business/Corporate</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="recipient">Someone in Need</SelectItem>
                  </SelectContent>
                </Select>
                
                {userType && (
                  <div className="space-y-2">
                    <Input placeholder="Full name" />
                    <Input placeholder="Email address" type="email" />
                    <Input placeholder="Phone number" type="tel" />
                    <Input placeholder="Password" type="password" />
                    <Input placeholder="Confirm password" type="password" />
                    
                    {userType === "nonprofit" && (
                      <>
                        <Input placeholder="Organization name" />
                        <Input placeholder="Registration number" />
                        <Input placeholder="Website" />
                      </>
                    )}
                    
                    {userType === "business" && (
                      <>
                        <Input placeholder="Company name" />
                        <Input placeholder="Business registration" />
                        <Input placeholder="Website" />
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {userType && (
                <Button className="w-full" variant="default">
                  Create Account
                </Button>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;