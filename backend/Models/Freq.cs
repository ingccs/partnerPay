using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("frequency")]
    public class FrequencyTypes
    {
        [Key]
        [Column("idfrecu")]
        public int IdFrecu { get; set; }

        [Required]
        [Column("frecuencia")]
        public string Frecuencia { get; set; } = string.Empty;

        [Required]
        [MaxLength(1)]
        [Column("letra")]
        public string Letra { get; set; } = string.Empty;
    }
}