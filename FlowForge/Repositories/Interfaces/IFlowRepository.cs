using FlowForge.DTOs;
using FlowForge.Models;

namespace FlowForge.Repositories.Interfaces
{
    public interface IFlowRepository
    {
        Task<IEnumerable<FlowResponseDto>> GetAllByUserAsync(string clerkUserId);

        Task<FlowResponseDto?> GetByIdAsync(int id);

        Task<FlowResponseDto> AddAsync(FlowCreateDto dto, string clerkUserId);

        Task<FlowResponseDto?> UpdateAsync(int id, FlowCreateDto dto);

        Task<bool> DeleteAsync(int id);
    }
}
