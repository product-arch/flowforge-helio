import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StartNodeProps } from '@/types/flow';
import { generateSampleFromSchema } from '@/utils/schema';

interface CopyCurlProps {
  startNodeProps: StartNodeProps;
  schemaString?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const CopyCurl: React.FC<CopyCurlProps> = ({
  startNodeProps,
  schemaString,
  variant = 'outline',
  size = 'sm',
  className
}) => {
  const { toast } = useToast();

  const generateCurlCommand = () => {
    const { trigger, auth, network } = startNodeProps;

    if (trigger !== 'webhook') {
      return null;
    }

    // Generate sample payload
    const samplePayload = schemaString ? generateSampleFromSchema(schemaString) : {
      message: "Hello from FlowForge!",
      to: "+919876543210"
    };

    // Build headers
    const headers: string[] = [
      "Content-Type: application/json"
    ];

    // Add auth header based on configuration
    if (auth) {
      switch (auth.kind) {
        case 'token':
          headers.push(`Authorization: Bearer YOUR_TOKEN_HERE`);
          break;
        case 'hmac':
          headers.push(`X-Signature: YOUR_HMAC_SIGNATURE_HERE`);
          break;
        case 'oauth2':
          headers.push(`Authorization: Bearer YOUR_OAUTH_TOKEN_HERE`);
          break;
      }
    }

    // Build curl command
    const headerParams = headers.map(h => `-H "${h}"`).join(' \\\n  ');
    const dataParam = JSON.stringify(samplePayload, null, 2)
      .split('\n')
      .map(line => `  ${line}`)
      .join('\n');

    const curlCommand = `curl -X POST \\
  ${headerParams} \\
  -d '{
${dataParam}
  }' \\
  https://api.flowforge.com/flows/YOUR_FLOW_ID/trigger`;

    return curlCommand;
  };

  const handleCopyCurl = () => {
    const curlCommand = generateCurlCommand();
    
    if (!curlCommand) {
      toast({
        title: "Not Available",
        description: "cURL generation is only available for webhook triggers",
        variant: "destructive"
      });
      return;
    }

    navigator.clipboard.writeText(curlCommand).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: "cURL command has been copied to your clipboard",
        className: "border-status-success bg-status-success/10 text-status-success"
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Failed to copy cURL command to clipboard",
        variant: "destructive"
      });
    });
  };

  const isWebhook = startNodeProps.trigger === 'webhook';

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopyCurl}
      disabled={!isWebhook}
      className={className}
      title={isWebhook ? "Copy as cURL command" : "Only available for webhook triggers"}
    >
      <Copy className="w-4 h-4 mr-2" />
      Copy cURL
      {isWebhook && <ExternalLink className="w-3 h-3 ml-1 opacity-60" />}
    </Button>
  );
};