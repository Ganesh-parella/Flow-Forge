using System.Text.Json;

using FlowForge.Core.FlowParser;
using FlowForge.Core.FlowParser.Models;
using FlowForge.Dtos;
using FlowForge.Repositories.Interfaces;
using FlowForge.Services.Interfaces;
using FlowForge.Core;

namespace FlowForge.Services
{
    public class FlowService:IFlowService
    {
        private readonly IFlowRepository _flowRepository;
        public FlowService(IFlowRepository flowRepository,FlowParser flowParser,ILogger<FlowService> logger,FlowEngine flowEngine)
        {
            _flowRepository = flowRepository;

        }
        
        public async Task<IEnumerable<FlowResponseDto>> GetFlowsByUserAsync(string clerkUserId) => await _flowRepository.GetAllByUserAsync(clerkUserId);
        public async  Task<FlowResponseDto?> GetFlowByIdAsync(string clerkUserName,int id)
        {
            return await  _flowRepository.GetByIdAsync(clerkUserName, id);
        }
        public async Task<FlowResponseDto> CreateFlowAsync(CreateFlowDto flowDto, string clerkUserId)
        {
    
            return await _flowRepository.CreateFlowAsync(clerkUserId, flowDto);
        }
        public async Task<FlowResponseDto?> UpdateFlowAsync(string clerkUserId,int id, CreateFlowDto flowDto)
        {
            return await _flowRepository.UpdateFlowAsync(clerkUserId,id, flowDto);
        }
        public async Task<bool> DeleteFlowAsync(string clerkUserId,int id)
        {
            return await _flowRepository.DeleteFlowAsync(clerkUserId,id);
        }
       

    }
}
