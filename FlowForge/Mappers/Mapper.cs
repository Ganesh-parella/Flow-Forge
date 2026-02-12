using FlowForge.Dtos;
using FlowForge.Models;
using FlowForge.Dtos;
using FlowForge.Models;

namespace FlowForge.Mappers
{
    public static class Mapper
    {
        public static FlowResponseDto toFlowResponseDto(Flow flow)
        {
            return new FlowResponseDto
            {

                Id = flow.Id,
                Name = flow.Name,
                DefinitionJson = flow.DefinitionJson,
                CreatedAt = flow.CreatedAt,
                UpdatedAt = flow.UpdatedAt
            };
        }
    }
}
