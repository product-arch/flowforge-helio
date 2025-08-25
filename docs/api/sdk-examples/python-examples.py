"""
FlowForge API - Python Examples

This file contains practical examples of using the FlowForge API
with Python. These examples demonstrate common use cases and
best practices for integration.
"""

import requests
import json
import time
import hmac
import hashlib
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta


class FlowForgeClient:
    """FlowForge API client for Python applications."""
    
    def __init__(self, api_key: str, base_url: str = "https://api.flowforge.com/v1"):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })

    def _request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        """Make an API request with error handling and retry logic."""
        url = f"{self.base_url}{endpoint}"
        
        for attempt in range(3):  # Max 3 attempts
            try:
                response = self.session.request(method, url, **kwargs)
                
                # Handle rate limiting
                if response.status_code == 429:
                    reset_time = int(response.headers.get('X-RateLimit-Reset', 0))
                    wait_time = max(0, reset_time - int(time.time()))
                    
                    if wait_time > 0:
                        print(f"Rate limited. Waiting {wait_time} seconds...")
                        time.sleep(wait_time)
                        continue
                
                response.raise_for_status()
                return response.json()
                
            except requests.exceptions.RequestException as e:
                if attempt == 2:  # Last attempt
                    raise Exception(f"API request failed after 3 attempts: {str(e)}")
                
                # Exponential backoff
                wait_time = (2 ** attempt) * 1000 / 1000  # Convert to seconds
                print(f"Attempt {attempt + 1} failed. Retrying in {wait_time}s...")
                time.sleep(wait_time)

    # Flow Management Methods
    def list_flows(self, **params) -> Dict[str, Any]:
        """List all flows with optional filtering."""
        return self._request('GET', '/flows', params=params)

    def get_flow(self, flow_id: str) -> Dict[str, Any]:
        """Get a specific flow by ID."""
        return self._request('GET', f'/flows/{flow_id}')

    def create_flow(self, flow_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new flow."""
        return self._request('POST', '/flows', json=flow_data)

    def update_flow(self, flow_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing flow."""
        return self._request('PUT', f'/flows/{flow_id}', json=updates)

    def activate_flow(self, flow_id: str) -> Dict[str, Any]:
        """Activate a flow."""
        return self._request('POST', f'/flows/{flow_id}/activate')

    def deactivate_flow(self, flow_id: str) -> Dict[str, Any]:
        """Deactivate a flow."""
        return self._request('POST', f'/flows/{flow_id}/deactivate')

    def simulate_flow(self, flow_id: str, test_params: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate flow execution."""
        return self._request('POST', f'/flows/{flow_id}/simulate', 
                           json={'test_parameters': test_params})

    # Message Operations
    def send_message(self, flow_id: str, message_data: Dict[str, Any]) -> Dict[str, Any]:
        """Send a single message through a flow."""
        return self._request('POST', f'/flows/{flow_id}/messages', json=message_data)

    def send_bulk_messages(self, flow_id: str, messages: List[Dict[str, Any]], 
                          options: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Send multiple messages in bulk."""
        payload = {'messages': messages}
        if options:
            payload['options'] = options
        return self._request('POST', f'/flows/{flow_id}/messages/bulk', json=payload)

    def get_message_status(self, message_id: str) -> Dict[str, Any]:
        """Get the status of a specific message."""
        return self._request('GET', f'/messages/{message_id}')

    # Analytics
    def get_flow_analytics(self, flow_id: str, **params) -> Dict[str, Any]:
        """Get analytics for a specific flow."""
        return self._request('GET', f'/flows/{flow_id}/analytics', params=params)

    def get_global_analytics(self, **params) -> Dict[str, Any]:
        """Get global analytics across all flows."""
        return self._request('GET', '/analytics', params=params)

    # Vendor Management
    def list_vendors(self, **params) -> Dict[str, Any]:
        """List all configured vendors."""
        return self._request('GET', '/vendors', params=params)

    def get_vendor_health(self, vendor_id: str) -> Dict[str, Any]:
        """Get health status for a specific vendor."""
        return self._request('GET', f'/vendors/{vendor_id}/health')

    # Webhook Utilities
    def verify_webhook_signature(self, payload: str, signature: str, secret: str) -> bool:
        """Verify webhook signature for security."""
        expected_signature = hmac.new(
            secret.encode('utf-8'),
            payload.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        received_signature = signature.replace('sha256=', '')
        return hmac.compare_digest(expected_signature, received_signature)


# Example Usage Functions

def create_sms_marketing_flow(client: FlowForgeClient) -> str:
    """Create a comprehensive SMS marketing flow."""
    flow_config = {
        "name": "SMS Marketing Campaign",
        "description": "Multi-vendor SMS routing with fallback and analytics",
        "channel": "sms",
        "configuration": {
            "nodes": [
                {
                    "id": "start-1",
                    "type": "start",
                    "position": {"x": 100, "y": 100},
                    "data": {"label": "Start", "channel": "sms"}
                },
                {
                    "id": "filter-1",
                    "type": "filter",
                    "position": {"x": 250, "y": 100},
                    "data": {
                        "label": "Content Filter",
                        "criteria": [
                            {"field": "messageType", "operator": "equals", "value": "promotional"}
                        ],
                        "action": "allow"
                    }
                },
                {
                    "id": "sms-1",
                    "type": "sms",
                    "position": {"x": 400, "y": 100},
                    "data": {
                        "label": "SMS Channel",
                        "senderId": "MARKETING",
                        "messageType": "promotional",
                        "selectedVendors": ["twilio", "msg91", "textlocal"]
                    }
                },
                {
                    "id": "routing-1",
                    "type": "weightedsplit",
                    "position": {"x": 550, "y": 100},
                    "data": {
                        "label": "Vendor Routing",
                        "weights": [
                            {"vendorId": "twilio", "weight": 50},
                            {"vendorId": "msg91", "weight": 30},
                            {"vendorId": "textlocal", "weight": 20}
                        ],
                        "fallbackEnabled": True
                    }
                },
                {
                    "id": "analytics-1",
                    "type": "analytics",
                    "position": {"x": 700, "y": 100},
                    "data": {
                        "label": "Track Metrics",
                        "metrics": ["delivery_rate", "cost_per_message", "vendor_performance"]
                    }
                },
                {
                    "id": "terminal-1",
                    "type": "terminal",
                    "position": {"x": 850, "y": 100},
                    "data": {"label": "Sent", "state": "sent"}
                }
            ],
            "edges": [
                {"id": "edge-1", "source": "start-1", "target": "filter-1", "type": "custom"},
                {"id": "edge-2", "source": "filter-1", "target": "sms-1", "type": "custom"},
                {"id": "edge-3", "source": "sms-1", "target": "routing-1", "type": "custom"},
                {"id": "edge-4", "source": "routing-1", "target": "analytics-1", "type": "custom"},
                {"id": "edge-5", "source": "analytics-1", "target": "terminal-1", "type": "custom"}
            ]
        }
    }
    
    flow = client.create_flow(flow_config)
    return flow['id']


def send_personalized_campaign(client: FlowForgeClient, flow_id: str, customers: List[Dict]):
    """Send personalized messages to a list of customers."""
    messages = []
    
    for customer in customers:
        message = {
            "recipient": customer['phone'],
            "message": {
                "template_id": "marketing_template",
                "variables": {
                    "customer_name": customer['name'],
                    "offer_code": customer.get('offer_code', 'SAVE10'),
                    "expiry_date": customer.get('expiry_date', '2024-12-31')
                }
            },
            "metadata": {
                "customer_id": customer['id'],
                "campaign_id": "SUMMER_SALE_2024",
                "user_segment": customer.get('segment', 'general')
            }
        }
        messages.append(message)
    
    # Send in batches of 100
    batch_size = 100
    results = []
    
    for i in range(0, len(messages), batch_size):
        batch = messages[i:i + batch_size]
        result = client.send_bulk_messages(flow_id, batch, {
            "batch_size": batch_size,
            "rate_limit": 10,
            "callback_url": "https://your-app.com/webhooks/bulk-status"
        })
        results.append(result)
        print(f"Batch {i//batch_size + 1} queued: {result['batch_id']}")
    
    return results


def monitor_flow_performance(client: FlowForgeClient, flow_id: str):
    """Monitor and report on flow performance."""
    analytics = client.get_flow_analytics(flow_id, period='24h', granularity='hour')
    
    summary = analytics['summary']
    print(f"Flow Performance Report for {flow_id}")
    print(f"Total Messages: {summary['total_messages']:,}")
    print(f"Success Rate: {summary['success_rate']:.2f}%")
    print(f"Average Cost: ${summary['avg_cost_per_message']:.4f}")
    print(f"Total Cost: ${summary['total_cost']:.2f}")
    
    # Vendor performance breakdown
    print("\nVendor Performance:")
    for vendor in analytics['vendor_breakdown']:
        print(f"  {vendor['vendor_id']}: {vendor['messages']:,} messages, "
              f"{vendor['success_rate']:.1f}% success, ${vendor['avg_cost']:.4f} avg cost")
    
    # Check for issues
    if summary['success_rate'] < 95:
        print("⚠️  WARNING: Success rate below 95%")
    
    if summary['avg_cost_per_message'] > 0.05:
        print("⚠️  WARNING: Average cost above $0.05")
    
    return analytics


def setup_webhook_monitoring():
    """Example Flask webhook handler for monitoring events."""
    from flask import Flask, request, jsonify
    
    app = Flask(__name__)
    webhook_secret = "your-webhook-secret"
    
    @app.route('/webhooks/flowforge', methods=['POST'])
    def handle_webhook():
        signature = request.headers.get('X-FlowForge-Signature')
        payload = request.get_data(as_text=True)
        
        # Verify signature
        client = FlowForgeClient('dummy-key')
        if not client.verify_webhook_signature(payload, signature, webhook_secret):
            return jsonify({'error': 'Invalid signature'}), 401
        
        event = request.get_json()
        
        # Log all events
        print(f"[{datetime.now()}] Webhook event: {event['event']}")
        
        # Handle specific events
        if event['event'] == 'message.failed':
            # Alert on message failures
            send_alert_to_slack(f"Message failed: {event['data']['error_message']}")
        
        elif event['event'] == 'flow.activated':
            # Log flow activations
            log_flow_activation(event['data'])
        
        return jsonify({'status': 'received'}), 200
    
    return app


def send_alert_to_slack(message: str):
    """Send alert to Slack channel."""
    # Implementation depends on your Slack setup
    pass


def log_flow_activation(flow_data: Dict[str, Any]):
    """Log flow activation for audit purposes."""
    print(f"Flow activated: {flow_data['name']} (ID: {flow_data['flow_id']})")


# Advanced Examples

def implement_smart_routing(client: FlowForgeClient):
    """Create a flow with intelligent vendor routing based on performance."""
    
    # Get vendor health data
    vendors = client.list_vendors(channel='sms')
    healthy_vendors = [v for v in vendors['data'] if v['health']['status'] == 'healthy']
    
    # Create routing weights based on performance
    total_vendors = len(healthy_vendors)
    base_weight = 100 // total_vendors
    
    routing_weights = []
    for vendor in healthy_vendors:
        # Adjust weight based on success rate and cost
        success_rate = vendor['health']['success_rate_24h']
        cost_factor = 1 / vendor['pricing']['cost_per_message']  # Lower cost = higher weight
        
        adjusted_weight = int(base_weight * (success_rate / 100) * cost_factor)
        routing_weights.append({
            "vendorId": vendor['id'],
            "weight": adjusted_weight
        })
    
    # Normalize weights to sum to 100
    total_weight = sum(w['weight'] for w in routing_weights)
    for weight in routing_weights:
        weight['weight'] = int((weight['weight'] / total_weight) * 100)
    
    # Create flow with smart routing
    flow_config = {
        "name": "Smart SMS Routing",
        "description": "Intelligent routing based on vendor performance",
        "channel": "sms",
        "configuration": {
            "nodes": [
                {
                    "id": "start-1",
                    "type": "start",
                    "position": {"x": 100, "y": 100},
                    "data": {"label": "Start", "channel": "sms"}
                },
                {
                    "id": "routing-1",
                    "type": "weightedsplit",
                    "position": {"x": 300, "y": 100},
                    "data": {
                        "label": "Smart Routing",
                        "weights": routing_weights,
                        "fallbackEnabled": True
                    }
                }
            ],
            "edges": [
                {"id": "edge-1", "source": "start-1", "target": "routing-1", "type": "custom"}
            ]
        }
    }
    
    return client.create_flow(flow_config)


def batch_process_with_rate_limiting(client: FlowForgeClient, flow_id: str, 
                                   recipients: List[str], rate_limit: int = 10):
    """Process large batches with rate limiting."""
    
    def chunks(lst, n):
        """Yield successive n-sized chunks from lst."""
        for i in range(0, len(lst), n):
            yield lst[i:i + n]
    
    results = []
    
    for batch_num, recipient_batch in enumerate(chunks(recipients, rate_limit)):
        print(f"Processing batch {batch_num + 1}...")
        
        messages = [
            {
                "recipient": recipient,
                "message": {
                    "text": f"Hello! This is message {i+1} from batch {batch_num + 1}",
                    "template_id": "batch_template"
                },
                "metadata": {
                    "batch_id": f"batch_{batch_num + 1}",
                    "message_index": i
                }
            }
            for i, recipient in enumerate(recipient_batch)
        ]
        
        try:
            result = client.send_bulk_messages(flow_id, messages)
            results.append(result)
            print(f"Batch {batch_num + 1} queued successfully: {result['batch_id']}")
            
            # Wait 1 second between batches to respect rate limits
            time.sleep(1)
            
        except Exception as e:
            print(f"Batch {batch_num + 1} failed: {str(e)}")
            results.append({"error": str(e), "batch": batch_num + 1})
    
    return results


def generate_performance_report(client: FlowForgeClient, flow_ids: List[str], 
                              days: int = 7) -> Dict[str, Any]:
    """Generate a comprehensive performance report."""
    
    report = {
        "generated_at": datetime.now().isoformat(),
        "period_days": days,
        "flows": [],
        "summary": {
            "total_messages": 0,
            "total_cost": 0,
            "avg_success_rate": 0,
            "cost_savings": 0
        }
    }
    
    total_success_rates = []
    
    for flow_id in flow_ids:
        try:
            analytics = client.get_flow_analytics(flow_id, period=f'{days}d')
            flow_data = client.get_flow(flow_id)
            
            flow_report = {
                "flow_id": flow_id,
                "name": flow_data['name'],
                "channel": flow_data['channel'],
                "status": flow_data['status'],
                "metrics": analytics['summary'],
                "vendor_performance": analytics['vendor_breakdown'],
                "recommendations": []
            }
            
            # Add recommendations based on performance
            if analytics['summary']['success_rate'] < 95:
                flow_report['recommendations'].append(
                    "Consider reviewing vendor configuration - success rate below 95%"
                )
            
            if analytics['summary']['avg_cost_per_message'] > 0.05:
                flow_report['recommendations'].append(
                    "High cost per message - review vendor pricing and routing weights"
                )
            
            report['flows'].append(flow_report)
            
            # Update summary
            report['summary']['total_messages'] += analytics['summary']['total_messages']
            report['summary']['total_cost'] += analytics['summary']['total_cost']
            total_success_rates.append(analytics['summary']['success_rate'])
            
        except Exception as e:
            print(f"Failed to get analytics for flow {flow_id}: {str(e)}")
    
    # Calculate averages
    if total_success_rates:
        report['summary']['avg_success_rate'] = sum(total_success_rates) / len(total_success_rates)
    
    return report


# Main execution example
def main():
    """Main example demonstrating various API operations."""
    
    # Initialize client
    client = FlowForgeClient('your-api-token')
    
    try:
        # 1. Create and activate a flow
        print("Creating SMS flow...")
        flow = create_sms_marketing_flow(client)
        flow_id = flow['id']
        print(f"Flow created: {flow_id}")
        
        # Activate the flow
        client.activate_flow(flow_id)
        print("Flow activated")
        
        # 2. Send test messages
        print("Sending test messages...")
        test_recipients = ['+1234567890', '+0987654321']
        
        for recipient in test_recipients:
            message = client.send_message(flow_id, {
                "recipient": recipient,
                "message": {
                    "text": f"Hello! This is a test message from FlowForge Python SDK.",
                    "template_id": "test_template"
                },
                "metadata": {
                    "campaign_id": "PYTHON_SDK_TEST",
                    "test_run": True
                }
            })
            print(f"Message sent to {recipient}: {message['message_id']}")
        
        # 3. Monitor performance
        time.sleep(10)  # Wait for some processing
        analytics = client.get_flow_analytics(flow_id, period='1h')
        print(f"Flow analytics: {analytics['summary']}")
        
        # 4. Generate report
        report = generate_performance_report(client, [flow_id], days=1)
        print(f"Performance report generated with {len(report['flows'])} flows")
        
    except Exception as e:
        print(f"Example execution failed: {str(e)}")


if __name__ == "__main__":
    main()