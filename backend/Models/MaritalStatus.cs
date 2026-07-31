using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    [Table("ecivil")]
    public class MaritalStatus
    {
        [Key]
        [Column("idecivil")]
        public int IdEcivil { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("ecivil")]
        public string Ecivil { get; set; } = string.Empty;

        [Required]
        [MaxLength(1)]
        [Column("letra")]
        public string Letra { get; set; } = string.Empty;
    }
}