using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AdvWebFinal.Server.Models
{
    public class PROJECTS
    {
        [Key]
        public int ProjectId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int UserId { get; set; }

        [JsonIgnore]
        public USERS? User { get; set; }
    }
}