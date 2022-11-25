using System.ComponentModel.DataAnnotations;

namespace ProfileManagement.Models
{
    public abstract class BaseEntity
    {
        [Key]
        public int Id { get; set; }

        public DateTime? EntryDate { get; set; }

        public string ModifiedUser { get; set; }

        public DateTime? ModifiedDate { get; set; }

    }
}
