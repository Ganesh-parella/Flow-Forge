using FlowForge.Dtos;
using FlowForge.Mappers;
using FlowForge.Models;
using FlowForge.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FlowForge.Repositories
{
    public class FlowRepository:IFlowRepository
    {
        private readonly AppDbContext _context;
        public FlowRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<FlowResponseDto>> GetAllByUserAsync(string clearkUerId)
        {
            var flows = await _context.Flows
                .Where(f => f.ClearkUerId == clearkUerId)
                .ToListAsync();
            return flows.Select(Mapper.toFlowResponseDto);
        }
        public async Task<FlowResponseDto> GetByIdAsync(string clearkUerName, int id)
        {
            Flow flow = await _context.Flows
                .FirstOrDefaultAsync(f => f.ClearkUerId == clearkUerName && f.Id == id);
            if (flow == null)
            {
                return null;
            }
            return Mapper.toFlowResponseDto(flow);
        }
        public async Task<FlowResponseDto> CreateFlowAsync(string clearkUerId, CreateFlowDto createFlowDto)
        {
            Flow newFlow = new Flow
            {
                ClearkUerId = clearkUerId,
                Name = createFlowDto.Name,
                DefinitionJson = createFlowDto.DefinitionJson,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _context.Flows.AddAsync(newFlow);
            await _context.SaveChangesAsync();
            return Mapper.toFlowResponseDto(newFlow);
        }
        public async Task<FlowResponseDto> UpdateFlowAsync(string clearkUerId, int id, CreateFlowDto updateFlowDto)
        {
            Flow? existing = await _context.Flows
                .FirstOrDefaultAsync(f => f.ClearkUerId == clearkUerId && f.Id == id);
            if (existing == null)
            {
                return null;
            }
            existing.Name = updateFlowDto.Name;
            existing.DefinitionJson = updateFlowDto.DefinitionJson;
            existing.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Mapper.toFlowResponseDto(existing);
        }
        public async Task<bool> DeleteFlowAsync(string clearkUerId, int id)
        {
            Flow? existing = await _context.Flows
                .FirstOrDefaultAsync(f => f.ClearkUerId == clearkUerId && f.Id == id);
            if (existing == null)
            {
                return false;
            }
            _context.Flows.Remove(existing);
            await _context.SaveChangesAsync();
            return true;

        }
    }
}
