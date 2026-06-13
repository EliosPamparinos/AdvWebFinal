using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AdvWebFinal.Server.Models
{
    public class TASKS
    {
        [Key]
        public int TaskId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
        public DateTime DueDate { get; set; }

        public int ProjectId { get; set; }
        [JsonIgnore]
        public PROJECTS? Project { get; set; } = null!;

        public int UserId { get; set; }
        [JsonIgnore]
        public USERS? User { get; set; } = null!;
    }
}