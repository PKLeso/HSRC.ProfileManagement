using ProfileManagement.DTOs;
using System.Security.Claims;

namespace ProfileManagement.Services
{
    public interface IAuthManager
    {
        Task<bool> ValidateUser(LoginUserDTO userDTO);

        Task<string> CreateToken();

    }
}
