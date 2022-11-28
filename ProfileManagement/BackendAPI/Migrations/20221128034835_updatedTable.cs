using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProfileManagement.Migrations
{
    public partial class updatedTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "db7a433a-4a4c-4bc7-863a-69db5282ffab");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ef968a1b-dff2-4bc6-bda8-0e7a7d90238c");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "AspNetUsers",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "a0db86ae-11cd-445b-8d25-a4b76c6399d8", "1d715920-01e0-4692-a8c9-b535b2a364da", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "b81c8cdb-0aac-4259-8ded-38ac5aaa050d", "fad712b0-ac3b-418c-a926-44f266f5e4df", "Admin", "ADMIN" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a0db86ae-11cd-445b-8d25-a4b76c6399d8");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b81c8cdb-0aac-4259-8ded-38ac5aaa050d");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "AspNetUsers",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256,
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "db7a433a-4a4c-4bc7-863a-69db5282ffab", "b3f8940d-43c8-4fe2-8e12-ccdb22cddea4", "User", "USER" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "ef968a1b-dff2-4bc6-bda8-0e7a7d90238c", "fb1cec48-3a56-42dd-9a94-0527bfae1574", "Admin", "ADMIN" });
        }
    }
}
