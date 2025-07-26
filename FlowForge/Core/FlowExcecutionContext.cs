using System.Text.Json;

namespace FlowForge.Core
{
    public class FlowExecutionContext
    {
        public string ClerkUserId { get; }
        public Dictionary<string, object> Payload { get; private set; }
        public JsonElement NodeConfiguration { get; }

        public FlowExecutionContext(string clerkUserId, Dictionary<string, object> initialPayload, JsonElement nodeConfiguration)
        {
            ClerkUserId = clerkUserId;
            Payload = initialPayload ?? new Dictionary<string, object>();
            NodeConfiguration = nodeConfiguration;
        }

        public void MergePayload(Dictionary<string, object> newData)
        {
            if (newData == null) return;
            foreach (var item in newData)
            {
                Payload[item.Key] = item.Value;
            }
        }
    }

}
