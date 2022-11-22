using System.ComponentModel.DataAnnotations;

namespace ProfileManagement.Models
{
    public class Entry : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public int PhonebookId { get; set; }
    }
}
