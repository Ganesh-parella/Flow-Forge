using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FlowForge.Core;

namespace FlowForge.Core.Interfaces
{
    public interface INode
    {
        string Type { get; }
        Task<Dictionary<string, object>> ExecuteAsync(FlowExecutionContext context, IServiceProvider services);
    }
}
