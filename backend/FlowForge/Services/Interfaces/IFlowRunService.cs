namespace FlowForge.Services.Interfaces
{
    public interface IFlowRunService
    {
        Task RunFlowAsync(int flowId, string clerkUserId);
        Task RunFlowFromWebhookAsync(string clerkUserId,int flowId,Dictionary<string, object> initialPayload);
    }
}
