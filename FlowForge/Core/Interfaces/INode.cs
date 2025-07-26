namespace FlowForge.Core.Interfaces
{
    public interface INode
    {
        string Type { get; }

        Task<Dictionary<string, object>> ExecuteAsync(FlowExecutionContext context, IServiceProvider services);
    }
}
