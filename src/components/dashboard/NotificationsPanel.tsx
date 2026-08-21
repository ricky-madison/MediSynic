
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Notification {
  id: number;
  title: string;
  time: string;
  read: boolean;
}

interface NotificationsPanelProps {
  notifications: Notification[];
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4">
        <CardTitle className="text-lg">Recent Notifications</CardTitle>
        <Bell className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className={`flex items-start p-3 ${notification.read ? '' : 'bg-muted/50 rounded-md'}`}>
              <div className={`mr-3 shrink-0 rounded-full p-1.5 ${notification.read ? 'text-muted-foreground/70 bg-muted/30' : 'text-primary bg-primary/10'}`}>
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <p className={`text-sm font-medium leading-none ${notification.read ? '' : 'text-primary'}`}>{notification.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full text-primary hover:text-primary hover:bg-primary/5">
          View All Notifications
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationsPanel;
