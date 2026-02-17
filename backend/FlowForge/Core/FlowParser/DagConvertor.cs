using FlowForge.Core.FlowParser.Models;

namespace FlowForge.Core.FlowParser
{
    public class DagConvertor
    {
        public Dag ParsedFlowToDag(ParsedFlow flow)
        {
            if (flow == null)
                throw new ArgumentNullException(nameof(flow));

            var dag = new Dag
            {
                Name = flow.Name,
                NodesList = flow.Nodes.ToList(),
                TriggerNodes = flow.Nodes.Where(n => n.Istrigger).ToList()
            };

            // Initialize dictionaries
            foreach (var node in flow.Nodes)
            {
                dag.AdjList[node.Id] = new List<ParsedNode>();
                dag.ReverseAdjList[node.Id] = new List<string>();
            }

            foreach (var edge in flow.Edges)
            {
                var source = edge.SourceNodeId;
                var target = edge.TargetNodeId;

                var targetNode = flow.Nodes.FirstOrDefault(n => n.Id == target);

                if (targetNode != null)
                {
                    dag.AdjList[source].Add(targetNode);
                    dag.ReverseAdjList[target].Add(source);
                }
            }

            return dag;
        }

    }
}
