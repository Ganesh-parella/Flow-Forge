using FlowForge.Dtos;

namespace FlowForge.Repositories.Interfaces
{
    public interface IFlowRepository
    {
        public Task<IEnumerable<FlowResponseDto>> GetAllByUserAsync(string clearkUerId);
        public Task<FlowResponseDto> GetByIdAsync(string clearkUerName,int id);
        public Task<FlowResponseDto> CreateFlowAsync(string clearkUerId, CreateFlowDto createFlowDto);
        public Task<FlowResponseDto> UpdateFlowAsync(string clearkUerId, int id, CreateFlowDto updateFlowDto);
        public Task<bool> DeleteFlowAsync(string clearkUerId, int id);

    }
}
