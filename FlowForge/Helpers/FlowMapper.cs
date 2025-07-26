// Helpers/FlowMapper.cs
using FlowForge.DTOs;
using FlowForge.Models;

namespace FlowForge.Helpers
{
    public static class FlowMapper
    {
        public static FlowResponseDto ToDto(Flow flow)
        {
            return new FlowResponseDto
            {
                Id = flow.Id,
                Name = flow.Name,
                DefinitionJson = flow.DefinitionJson,
                ClerkUserId = flow.ClerkUserId,
                CreatedAt = flow.CreatedAt,
                UpdatedAt = flow.UpdatedAt
            };
        }
    }
}
