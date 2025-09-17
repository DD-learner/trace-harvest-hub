import { Calendar, CheckCircle, Clock, MapPin, FlaskConical, Package, Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TimelineEvent {
  id: string;
  type: 'harvest' | 'lab' | 'processing' | 'transport' | 'delivery';
  title: string;
  description: string;
  date: string;
  location?: string;
  details?: Record<string, any>;
  status: 'completed' | 'in-progress' | 'pending';
}

interface TimelineProps {
  events: TimelineEvent[];
}

const Timeline = ({ events }: TimelineProps) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'harvest':
        return <Package className="w-5 h-5" />;
      case 'lab':
        return <FlaskConical className="w-5 h-5" />;
      case 'processing':
        return <Package className="w-5 h-5" />;
      case 'transport':
        return <Truck className="w-5 h-5" />;
      case 'delivery':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getEventColor = (type: string, status: string) => {
    if (status === 'completed') {
      switch (type) {
        case 'harvest':
          return 'bg-primary text-primary-foreground';
        case 'lab':
          return 'bg-blue-500 text-white';
        case 'processing':
          return 'bg-accent text-accent-foreground';
        case 'transport':
          return 'bg-orange-500 text-white';
        case 'delivery':
          return 'bg-green-500 text-white';
        default:
          return 'bg-muted text-muted-foreground';
      }
    } else if (status === 'in-progress') {
      return 'bg-primary/80 text-primary-foreground animate-pulse';
    } else {
      return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Supply Chain Timeline</h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
        
        {sortedEvents.map((event, index) => (
          <div key={event.id} className="relative flex gap-6 pb-8 last:pb-0">
            {/* Event icon */}
            <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${getEventColor(event.type, event.status)} shadow-card`}>
              {getEventIcon(event.type)}
            </div>
            
            {/* Event content */}
            <div className="flex-1 min-w-0">
              <Card className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">{event.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    </div>
                    <Badge 
                      variant={event.status === 'completed' ? 'default' : 'outline'}
                      className={event.status === 'in-progress' ? 'animate-pulse' : ''}
                    >
                      {event.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Event details */}
                  {event.details && Object.keys(event.details).length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {Object.entries(event.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                          <span className="font-medium text-foreground">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;