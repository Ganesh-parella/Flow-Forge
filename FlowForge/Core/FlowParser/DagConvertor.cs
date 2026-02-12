using FlowForge.Core.FlowParser.Models;

namespace FlowForge.Core.FlowParser
{
    public class DagConvertor
    {
        public DagConvertor() 
        {

        }
        public Dag ParsedFlowToDag(ParsedFlow flow)
        {
            if(flow == null)
            {
                throw new ArgumentNullException(nameof(flow));
            }
            Dag dag = new Dag
            {
                Name = flow.Name,
                TriggerNodes = flow.Nodes.Where(n => n.Istrigger).ToList(),
                NodesList=flow.Nodes.ToList()
            };
            foreach (var node in flow.Nodes) 
            {
                dag.AdjList[node.Id] = new List<ParsedNode>();
            }
            foreach (var edge in flow.Edges)
            {
                string source=edge.SourceNodeId;
                string target=edge.TargetNodeId;
                var targetNode = flow.Nodes.FirstOrDefault(n => n.Id == target);
                if (targetNode != null)
                {
                    dag.AdjList[source].Add(targetNode);
                }
            }
            return dag;
        }
    }
}
