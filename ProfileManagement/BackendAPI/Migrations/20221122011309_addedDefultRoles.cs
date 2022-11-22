using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProfileManagement.Migrations
{
    public partial class addedDefultRoles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "6266e1d8-8bf8-4470-a716-61f345a11803", "50e7c123-98a3-4d52-a549-afa329dc2763", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "b8b51880-c5d4-4d40-b0bf-1d437f1d78d8", "d1d29bdc-6286-466a-8582-51832ae8bce7", "Administrator", "ADMINISTRATOR" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6266e1d8-8bf8-4470-a716-61f345a11803");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b8b51880-c5d4-4d40-b0bf-1d437f1d78d8");
        }
    }
}
