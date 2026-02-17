using FlowForge.API.Controllers;
using FlowForge.Core.FlowParser.Models;

namespace FlowForge.Core.FlowParser
{
    public  class TopoSortGenerator
    {
        private readonly ILogger<TopoSortGenerator> _logger;
        public TopoSortGenerator(ILogger<TopoSortGenerator> logger)
        {
            _logger = logger;
        }
        public  List<ParsedNode> GetTopologicalOrder(Dag dag)
        {
            if (dag == null)
            {
                throw new ArgumentNullException(nameof(dag));
            }
            _logger.LogInformation(dag.ToString());
            List<ParsedNode> sortedFlows = new List<ParsedNode>();
            Dictionary<string, int> inDegree = new Dictionary<string, int>();
            foreach (var node in dag.NodesList)
            {
                inDegree[node.Id] = 0;
            }
            foreach (var neighbors in dag.AdjList.Values)
            {
                foreach (var neighbor in neighbors)
                {
                    if (inDegree.ContainsKey(neighbor.Id))
                    {
                        inDegree[neighbor.Id]++;
                    }
                    else
                    {
                        inDegree[neighbor.Id] = 1;
                    }
                }
            }
                Queue<ParsedNode> zeroInDegreeQueue = new Queue<ParsedNode>();
                foreach (var node in dag.TriggerNodes)
                {
                    if (inDegree[node.Id] == 0)
                    {
                        zeroInDegreeQueue.Enqueue(node);
                    }
                }
                if (zeroInDegreeQueue.Count == 0)
                {
                    throw new InvalidOperationException("The DAG has no starting node (node with zero in-degree).");
                }
                while (zeroInDegreeQueue.Count > 0)
                {
                    ParsedNode u = zeroInDegreeQueue.Dequeue();
                    sortedFlows.Add(u);
                    foreach (var neighbor in dag.AdjList[u.Id])
                    {
                        inDegree[neighbor.Id]--;
                        if (inDegree[neighbor.Id] == 0)
                        {
                            zeroInDegreeQueue.Enqueue(neighbor);
                        }
                    }
                }

            if (sortedFlows.Count != dag.NodesList.Count)
            {
                throw new InvalidOperationException("Cycle detected or some nodes were not processed in the DAG.");
            }
            return sortedFlows;
        }
    }
}
