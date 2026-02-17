using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlowForge.Migrations
{
    /// <inheritdoc />
    public partial class AddStartedAtToNodeExecution : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Ststus",
                table: "FlowInstances",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "FlowInstances",
                newName: "StartedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Status",
                table: "FlowInstances",
                newName: "Ststus");

            migrationBuilder.RenameColumn(
                name: "StartedAt",
                table: "FlowInstances",
                newName: "CreatedAt");
        }
    }
}
