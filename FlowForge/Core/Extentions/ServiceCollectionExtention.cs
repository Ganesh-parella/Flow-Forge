using FlowForge.Core.Interfaces;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddNodeServices(this IServiceCollection services)
    {
        var nodeType = typeof(INode);

        var nodeImplementations = AppDomain.CurrentDomain.GetAssemblies()
            .SelectMany(a => a.GetTypes())
            .Where(t => nodeType.IsAssignableFrom(t) && t is { IsClass: true, IsAbstract: false });

        foreach (var type in nodeImplementations)
        {
            // THIS IS THE FIX:
            // This tells the DI container: "When someone asks for an INode,
            // this 'type' is one of the classes you can provide."
            services.AddScoped(typeof(INode), type);
        }

        return services;
    }
}