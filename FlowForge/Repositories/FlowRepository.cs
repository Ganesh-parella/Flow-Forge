using FlowForge.DTOs;
using FlowForge.Models;
using FlowForge.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using FlowForge.Helpers;

namespace FlowForge.Repositories
{
    public class FlowRepository : IFlowRepository
    {
        private readonly AppDbContext _context;

        public FlowRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FlowResponseDto>> GetAllByUserAsync(string clerkUserId)
        {
            var flows = await _context.Flows
                .Where(f => f.ClerkUserId == clerkUserId)
                .ToListAsync();

            return flows.Select(FlowMapper.ToDto);
        }

        public async Task<FlowResponseDto?> GetByIdAsync(int id)
        {
            var flow = await _context.Flows.FindAsync(id);
            return flow == null ? null : FlowMapper.ToDto(flow);
        }

        public async Task<FlowResponseDto> AddAsync(FlowCreateDto dto, string clerkUserId)
        {
            var flow = new Flow
            {
                Name = dto.Name,
                DefinitionJson = dto.DefinitionJson,
                ClerkUserId = clerkUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Flows.Add(flow);
            await _context.SaveChangesAsync();

            return FlowMapper.ToDto(flow);
        }

        public async Task<FlowResponseDto?> UpdateAsync(int id, FlowCreateDto dto)
        {
            var existing = await _context.Flows.FindAsync(id);
            if (existing == null) return null;

            existing.Name = dto.Name;
            existing.DefinitionJson = dto.DefinitionJson;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return FlowMapper.ToDto(existing);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var flow = await _context.Flows.FindAsync(id);
            if (flow == null) return false;

            _context.Flows.Remove(flow);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
