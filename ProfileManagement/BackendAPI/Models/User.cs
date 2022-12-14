using Microsoft.AspNetCore.Identity;

namespace ProfileManagement.Models
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Status { get; set; }
        public string ImagePath { get; set; }
    }
}
