using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TruckingApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddCargoTypeColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CargoType",
                table: "Orders",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CargoType",
                table: "Orders");
        }
    }
}
