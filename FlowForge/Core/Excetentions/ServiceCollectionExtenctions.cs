using FlowForge.Core.Interfaces;

namespace FlowForge.Core.Excetentions
{
    public static class ServiceCollectionExtenctions
    {
        public static IServiceCollection AddNodeServices(this IServiceCollection services)
        {
            var NodeType = typeof(INode);
            var implementations = AppDomain.CurrentDomain.GetAssemblies()
                .SelectMany(s => s.GetTypes())
                .Where(t => NodeType.IsAssignableFrom(t) && t is { IsClass: true, IsAbstract: false });
            foreach (var implementation in implementations)
            {
                services.AddScoped(typeof(INode), implementation);
            }
            return services;
        }
    }
}
