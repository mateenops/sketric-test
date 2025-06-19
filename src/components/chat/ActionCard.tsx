
'use client';

import type { SketricActionCardData } from '@/lib/types'; // Updated type
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface ActionCardProps {
  data: SketricActionCardData; // Updated type
  onActionSelect: (actionCardId: string, selectedValue: string) => void;
}

export function ActionCard({ data, onActionSelect }: ActionCardProps) {
  return (
    <Card className="w-full max-w-sm shadow-lg border-primary/50 bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-headline">{data.title}</CardTitle>
        {data.description && (
          <CardDescription>{data.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {data.imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <Image 
              src={data.imageUrl} 
              alt={data.title || 'Action card image'} 
              fill={true}
              style={{objectFit: 'cover'}}
              data-ai-hint="abstract illustration"
            />
          </div>
        )}
        {data.options && data.options.length > 0 ? (
          <div className="flex flex-col space-y-2">
            {data.options.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                onClick={() => onActionSelect(data.id, option.value)}
                className="w-full justify-start"
                aria-label={`Select ${option.label}`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        ) : (
          data.actionArguments && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Action:</strong> {data.actionName}</p>
              <p><strong>Arguments:</strong></p>
              <pre className="bg-muted p-2 rounded-md text-xs whitespace-pre-wrap">
                {JSON.stringify(data.actionArguments, null, 2)}
              </pre>
            </div>
          )
        )}
      </CardContent>
      {/* CardFooter can be used if needed */}
      {/* <CardFooter>
        <p className="text-xs text-muted-foreground">Action ID: {data.id}</p>
      </CardFooter> */}
    </Card>
  );
}
